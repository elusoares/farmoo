import { pool } from '@config/database'
import { ResultadoPorAnimalView } from './types'

const getResultadoRepository = async (): Promise<ResultadoPorAnimalView[]> => {
  const result = await pool.query<ResultadoPorAnimalView>(
    'SELECT * FROM farmoo.vw_resultado_por_animal ORDER BY animal_id'
  )
  return result.rows
}

export default getResultadoRepository
