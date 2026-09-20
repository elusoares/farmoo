import { pool } from '@config/database'
import { AnimalView } from '@repositories/get-animal-by-id/types'
import logger from '@utils/logger'
import { AnimalNotFoundError } from './error'

const getAnimalByIdRepository = async (id: string) => {
  const result = await pool.query<AnimalView>(
    `SELECT * FROM farmoo.vw_animais WHERE id = $1`,
    [id]
  )

  const animal = result.rows[0]

  if (!animal) {
    logger.error('Animal não encontrado', { animalId: id })
    throw new AnimalNotFoundError(`Animal com ID ${id} não encontrado`)
  }

  return animal
}

export default getAnimalByIdRepository