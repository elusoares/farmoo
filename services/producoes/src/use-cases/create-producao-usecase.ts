import { CreateProducaoBody } from '@controllers/producao/create-producao-controller/types'
import { createProducaoRepository } from '@repositories/create-producao'

const createProducaoUseCase = async (producaoData: CreateProducaoBody) => {
  return await createProducaoRepository({
    animalId: producaoData.animalId,
    tipo: producaoData.tipo,
    quantidade: producaoData.quantidade,
    unidade: producaoData.unidade,
    data: new Date(producaoData.data),
  })
}

export default createProducaoUseCase
