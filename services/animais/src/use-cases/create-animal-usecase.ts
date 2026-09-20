import { CreateAnimalBody } from '@controllers/animal/create-animal-controller/types'
import { createAnimalRepository } from '@repositories/create-animal'

const createAnimalUseCase = async (animalData: CreateAnimalBody) => {
  const animal = await createAnimalRepository(
    animalData.origem === 'comprado'
      ? {
          tipo: animalData.tipo,
          nome: animalData.nome,
          origem: animalData.origem,
          valorCompra: animalData.valorCompra,
          dataCompra: new Date(animalData.dataCompra),
        }
      : {
          tipo: animalData.tipo,
          nome: animalData.nome,
          origem: animalData.origem,
          dataNascimento: new Date(animalData.dataNascimento),
          maeId: animalData.maeId,
          ...(animalData.paiId !== undefined ? { paiId: animalData.paiId } : {}),
        }
  )
  return animal
}

export default createAnimalUseCase
