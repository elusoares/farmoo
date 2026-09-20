import { pool } from '@config/database'
import { AnimalView } from '../get-animal-by-id/types'

// futuramente implementar paginação
const getAllAnimalsRepository = async (): Promise<AnimalView[]> => {
  const result = await pool.query<AnimalView>('SELECT * FROM farmoo.vw_animais')

  return result.rows
}

export default getAllAnimalsRepository
