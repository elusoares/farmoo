import { pool } from '@config/database'
import { Producao } from '@repositories/create-producao/types'
import logger from '@utils/logger'
import { EmptyProducaoUpdateError, ProducaoUpdateNotFoundError } from './errors'
import { UpdateProducaoData } from './types'

const producaoColumns: ReadonlyArray<{
  key: keyof UpdateProducaoData
  column: string
}> = [
  { key: 'id', column: 'id' },
  { key: 'tipo', column: 'tipo' },
  { key: 'quantidade', column: 'quantidade' },
  { key: 'unidade', column: 'unidade' },
  { key: 'data', column: 'data' },
  { key: 'vendido', column: 'vendido' },
  { key: 'valorVenda', column: 'valor_venda' },
  { key: 'dataVenda', column: 'data_venda' },
]

const updateProducaoRepository = async (
  data: UpdateProducaoData
): Promise<Producao> => {
  const producaoId = data.id
  const values: unknown[] = []
  const assignments: string[] = []

  for (const { key, column } of producaoColumns) {
    const value = data[key]

    if (value !== undefined && key !== 'id') {
      values.push(value)
      assignments.push(`${column} = $${values.length}`)
    }
  }

  if (assignments.length === 0) {
    throw new EmptyProducaoUpdateError('Nenhum campo foi informado para atualização')
  }
  
  const result = await pool.query<Producao>(
    `UPDATE farmoo.producoes
		 SET ${assignments.join(', ')}
		 WHERE id = ${producaoId}
		 RETURNING *`,
    values
  )

  const producao = result.rows[0]

  if (!producao) {
    logger.warn('Produção não encontrada para atualização', { producaoId })
    throw new ProducaoUpdateNotFoundError(`Produção com ID ${producaoId} não encontrada`)
  }

  return producao
}

export default updateProducaoRepository
