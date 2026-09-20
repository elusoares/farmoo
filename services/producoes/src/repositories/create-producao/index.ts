import { pool } from '@config/database'
import logger from '@utils/logger'
import { ProducaoCreationError } from './errors'
import { CreateProducaoData, Producao } from './types'

export const createProducaoRepository = async (data: CreateProducaoData): Promise<Producao> => {
  const result = await pool.query<Producao>(
    `INSERT INTO farmoo.producoes (
      animal_id,
      tipo,
      quantidade,
      unidade,
      data
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [data.animalId, data.tipo, data.quantidade, data.unidade, data.data]
  )

  const producao = result.rows[0]

  if (!producao) {
    logger.error('Falha ao criar producao: nenhum registro retornado', {
      animalId: data.animalId,
      tipo: data.tipo,
    })
    throw new ProducaoCreationError(
      'A produção não foi retornada após a inserção no banco de dados'
    )
  }

  return producao
}
