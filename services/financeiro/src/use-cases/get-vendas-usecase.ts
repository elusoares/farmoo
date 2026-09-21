import getVendasRepository from '@repositories/get-vendas'

const getVendasUseCase = async () => {
  return await getVendasRepository()
}

export default getVendasUseCase
