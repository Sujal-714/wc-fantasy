import dotenv from 'dotenv'
dotenv.config()

const required = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env var: ${key}`)
  return value
}

export const config = {
  database_url: required('DATABASE_URL'),
  jwt_secret:   required('JWT_SECRET'),
  api_football_key: required('API_FOOTBALL_KEY'),
  port:   Number(process.env.PORT) || 3000,
  gemini_api_key: required('GEMINI_API_KEY'),
  serper_key: required('SERPER_API_KEY'),
}