import { pool } from '@config/database'
import logger from '@utils/logger'
import { AnimalUpdateNotFoundError, EmptyAnimalUpdateError } from './errors'
import { UpdateAnimalData, UpdatedAnimal } from './types'

const animalColumns: ReadonlyArray<{
  key: keyof UpdateAnimalData
  column: string
}> = [
  { key: 'id', column: 'id' },
  { key: 'tipo', column: 'tipo' },
  { key: 'nome', column: 'nome' },
  { key: 'origem', column: 'origem' },
  { key: 'valorCompra', column: 'valor_compra' },
  { key: 'dataCompra', column: 'data_compra' },
  { key: 'dataNascimento', column: 'data_nascimento' },
  { key: 'maeId', column: 'mae_id' },
  { key: 'paiId', column: 'pai_id' },
  { key: 'vendido', column: 'vendido' },
  { key: 'valorVenda', column: 'valor_venda' },
  { key: 'dataVenda', column: 'data_venda' },
]

const updateAnimalRepository = async (
  data: UpdateAnimalData
): Promise<UpdatedAnimal> => {
  const animalId = data.id
  const values: unknown[] = []
  const assignments: string[] = []

  for (const { key, column } of animalColumns) {
    const value = data[key]

    if (value !== undefined && key !== 'id') {
      values.push(value)
      assignments.push(`${column} = $${values.length}`)
    }
  }

  if (assignments.length === 0) {
    throw new EmptyAnimalUpdateError('Nenhum campo foi informado para atualização')
  }
  
  const result = await pool.query<UpdatedAnimal>(
    `UPDATE farmoo.animais
		 SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
		 WHERE id = ${animalId}
		 RETURNING *`,
    values
  )

  const animal = result.rows[0]

  if (!animal) {
    logger.warn('Animal não encontrado para atualização', { animalId: animalId })
    throw new AnimalUpdateNotFoundError(`Animal com ID ${animalId} não encontrado`)
  }

  return animal
}

export default updateAnimalRepository
