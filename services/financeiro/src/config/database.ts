import { Pool } from 'pg'
import { ENV } from './env'

export const pool = new Pool({
  host: ENV.db.host,
  port: ENV.db.port,
  user: ENV.db.user,
  password: ENV.db.password,
  database: ENV.db.name,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (error) => {
  console.error('❌ Erro inesperado no pool do Postgres:', error)
})

export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect()
    const result = await client.query<{ now: Date }>('SELECT NOW() AS now')
    client.release()
    console.log(`✅ Conectado ao Postgres (${ENV.db.host}:${ENV.db.port}) - ${result.rows[0]?.now}`)
  } catch (error) {
    console.error('❌ Falha ao conectar no Postgres:', error)
    throw error
  }
}
