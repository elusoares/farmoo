import { SellAnimalRequest } from '@controllers/animal/sell-animal-controller/types'
import updateAnimalRepository from '@repositories/update-animal'

const sellAnimalUseCase = async ({
  id,
  valorVenda,
  dataVenda,
}: SellAnimalRequest) => {
  const animal = await updateAnimalRepository({
    id: Number(id),
    vendido: true,
    valorVenda: valorVenda,
    dataVenda: new Date(dataVenda),
  })

  return animal
}

export default sellAnimalUseCase
