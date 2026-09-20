import getAllProducoesRepository from '@repositories/get-all-producoes'

const getAllProducoesUseCase = async () => {
  return await getAllProducoesRepository()
}

export default getAllProducoesUseCase