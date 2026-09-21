import getAllCustosRepository from '@repositories/get-all-custos'

const getAllCustosUseCase = async () => {
  return await getAllCustosRepository()
}

export default getAllCustosUseCase
