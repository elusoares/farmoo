import { CreateCustoBody } from '@controllers/custo/create-custo-controller/types'
import { createCustoRepository } from '@repositories/create-custo'

const createCustoUseCase = async (custoData: CreateCustoBody) => {
  return await createCustoRepository({
    tipo: custoData.tipo,
    descricao: custoData.descricao,
    valor: custoData.valor,
    data: new Date(custoData.data),
    animalId: custoData.animalId,
  })
}

export default createCustoUseCase
