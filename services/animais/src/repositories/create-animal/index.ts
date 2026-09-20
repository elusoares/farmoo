import { pool } from '@config/database'
import { logger } from '@utils/logger'
import { AnimalCreationError } from './errors'
import { AnimalRow, CreateAnimalData } from './types'

export const createAnimalRepository = async (data: CreateAnimalData): Promise<AnimalRow> => {
  const result = await pool.query<AnimalRow>(
    `INSERT INTO farmoo.animais (
			tipo,
			nome,
			origem,
			valor_compra,
			data_compra,
			data_nascimento,
			mae_id,
			pai_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING *`,
    [
      data.tipo,
      data.nome,
      data.origem,
      data.valorCompra ?? null,
      data.dataCompra ?? null,
      data.dataNascimento ?? null,
      data.maeId ?? null,
      data.paiId ?? null,
    ]
  )

  const animal = result.rows[0]

  if (!animal) {
    logger.error('Falha ao criar animal: nenhum registro retornado', {
      tipo: data.tipo,
      nome: data.nome,
    })
    throw new AnimalCreationError('O animal não foi retornado após a inserção no banco de dados')
  }

  return animal
}
