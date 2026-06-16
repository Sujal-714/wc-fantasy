import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { config } from '../config'

const genAI = new GoogleGenerativeAI(config.gemini_api_key)
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })

// ── Search for a match report URL given two teams and a date ───
export const findMatchReportUrl = async (
  homeTeam: string,
  awayTeam: string,
  date: string
): Promise<string> => {
  const query = `${homeTeam} vs ${awayTeam} World Cup 2026 match report ${date}`

  const res = await axios.post(
    'https://google.serper.dev/search',
    { q: query },
    {
      headers: {
        'X-API-KEY': config.serper_key,
        'Content-Type': 'application/json',
      }
    }
  )

  const results = res.data.organic || []
  if (results.length === 0) throw new Error('No match report found')

  // Prefer trusted sports sites
  const trustedDomains = ['espn.com', 'bbc.com', 'fifa.com', 'nbcsports.com', 'foxsports.com', 'skysports.com']
  const preferred = results.find((r: any) =>
    trustedDomains.some(domain => r.link.includes(domain))
  )

  return (preferred || results[0]).link
}

// ── Fetch a match report URL and extract readable text ─────────
export const fetchArticleText = async (url: string): Promise<string> => {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }, // some sites block default axios UA
    timeout: 10000,
  })

  const $ = cheerio.load(data)

  // Remove noise
  $('script, style, nav, header, footer, aside').remove()

  // Try common article containers first, fallback to body
  let text = $('article').text() || $('main').text() || $('body').text()

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // Limit length to avoid huge token usage
  return text.slice(0, 8000)
}

// ── Extract structured stats from match report text ─────────────
export const extractStats = async (matchReport: string, playerNames: string[]) => {
  const prompt = `Extract player statistics from this match report or match data. Only include players from this list: ${playerNames.join(', ')}.

  The report may be written as prose, or as a compact scoreline format like "PlayerName - 51'" which means that player scored a goal in the 51st minute. Treat any "Name - minute'" pattern as a goal scored by that player at that minute.

Match report:
${matchReport}

Return ONLY valid JSON, no other text, no markdown code fences, in this exact format:
[
  {
    "name": "player name exactly as it appears in the list",
    "goals": 0,
    "assists": 0,
    "minutes_played": 90,
    "clean_sheet": false,
    "yellow_cards": 0,
    "red_cards": 0,
    "saves": 0,
    "penalties_missed": 0
  }
]

If a stat isn't mentioned, default to 0 or false. minutes_played defaults to 90 unless substitution or injury is mentioned.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}