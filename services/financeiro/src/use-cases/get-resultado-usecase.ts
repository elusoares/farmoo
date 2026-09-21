import getResultadoRepository from '@repositories/get-resultado'

const getResultadoUseCase = async () => {
  return await getResultadoRepository()
}

export default getResultadoUseCase
