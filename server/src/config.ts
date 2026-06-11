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
  rapidapi_key: required('RAPIDAPI_KEY'),
  port:         Number(process.env.PORT) || 3000,
}