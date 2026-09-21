import { pool } from '@config/database'
import { CustoView } from './types'

const getAllCustosRepository = async (): Promise<CustoView[]> => {
  const result = await pool.query<CustoView>(
    'SELECT * FROM farmoo.vw_custos ORDER BY data DESC, id DESC'
  )
  return result.rows
}

export default getAllCustosRepository
