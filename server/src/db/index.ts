import { Pool } from 'pg'
import {config} from '../config';


const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: config.database_url,
  ssl: isProduction ? { rejectUnauthorized: false } : false
})

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('DB connection failed:', err.message)
  } else {
    console.log('DB connected successfully')
    release()
  }
})

export default pool