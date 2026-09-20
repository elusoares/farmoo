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

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do Postgres:', err)
})

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect()
    const result = await client.query<{ now: Date }>('SELECT NOW() as now')
    client.release()
    console.log(`✅ Conectado ao Postgres (${ENV.db.host}:${ENV.db.port}) — ${result.rows[0]?.now}`)
  } catch (err) {
    console.error('❌ Falha ao conectar no Postgres:', err)
    throw err
  }
}