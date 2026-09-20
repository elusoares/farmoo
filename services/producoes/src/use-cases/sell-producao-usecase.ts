import { SellProducaoRequest } from '@controllers/producao/sell-producao-controller/types'
import updateProducaoRepository from '@repositories/update-producao'

const sellProducaoUseCase = async ({
  id,
  valorVenda,
  dataVenda,
}: SellProducaoRequest) => {
  const producao = await updateProducaoRepository({
    id: Number(id),
    vendido: true,
    valorVenda: valorVenda,
    dataVenda: new Date(dataVenda),
  })

  return producao
}

export default sellProducaoUseCase
