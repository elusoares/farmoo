import { pool } from '@config/database'
import { ProducaoView } from './types'

// futuramente implementar paginação
const getAllProducoesRepository = async (): Promise<ProducaoView[]> => {
  const result = await pool.query<ProducaoView>('SELECT * FROM farmoo.vw_producoes')

  return result.rows
}

export default getAllProducoesRepository
