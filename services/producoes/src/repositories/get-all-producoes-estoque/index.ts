import { pool } from '@config/database'
import { EstoqueProducaoView } from './types'

// futuramente implementar paginação
const getAllProducoesEstoqueRepository = async (): Promise<EstoqueProducaoView[]> => {
  const result = await pool.query<EstoqueProducaoView>('SELECT * FROM farmoo.vw_estoque_producoes')

  return result.rows
}

export default getAllProducoesEstoqueRepository
