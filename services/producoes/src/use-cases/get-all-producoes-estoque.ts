import getAllProducoesEstoqueRepository from '@repositories/get-all-producoes-estoque'

const getAllProducoesEstoqueUseCase = async () => {
  return await getAllProducoesEstoqueRepository()
}

export default getAllProducoesEstoqueUseCase