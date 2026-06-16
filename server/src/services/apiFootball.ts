import axios from 'axios'
import { config } from '../config'

const client = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key':  config.api_football_key,
  }
})

// Get all fixtures for WC 2026
export const getFixtures = async () => {
  const res = await client.get('/fixtures', {
    params: { league: 1, season: 2026 }
  })
  return res.data.response
}

// Get player stats for a specific finished match
export const getMatchStats = async (apiMatchId: number) => {
  const res = await client.get('/fixtures/players', {
    params: { fixture: apiMatchId }
  })
  return res.data.response
}

// Get WC 2026 squads
export const getSquads = async () => {
  const res = await client.get('/players/squads', {
    params: { league: 1, season: 2026 }
  })
  return res.data.response
}