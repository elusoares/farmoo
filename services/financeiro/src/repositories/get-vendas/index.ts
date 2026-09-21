import { pool } from '@config/database'
import { VendaView } from './types'

const getVendasRepository = async (): Promise<VendaView[]> => {
  const result = await pool.query<VendaView>(
    'SELECT * FROM farmoo.vw_vendas ORDER BY data DESC, id DESC'
  )
  return result.rows
}

export default getVendasRepository
