import { pool } from '@config/database'
import logger from '@utils/logger'
import { CustoCreationError } from './errors'
import { CreateCustoData, Custo } from './types'

export const createCustoRepository = async (data: CreateCustoData): Promise<Custo> => {

  const result = await pool.query<Custo>(
    `INSERT INTO farmoo.custos (
        tipo,
        descricao,
        valor,
        data,
        animal_id
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
    [data.tipo, data.descricao ?? null, data.valor, data.data, data.animalId ?? null]
  )

  const custo = result.rows[0]
  if (!custo) {
    logger.error('Falha ao criar custo: nenhum registro retornado', { tipo: data.tipo })
    throw new CustoCreationError('O custo não foi retornado após a inserção')
  }
  
  return custo
}
