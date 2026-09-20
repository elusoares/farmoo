import getAnimalByIdRepository from '@repositories/get-animal-by-id'
import { AnimalView } from '@repositories/get-animal-by-id/types'

const getAnimalByIdUseCase = async (id: string): Promise<AnimalView> => {
  const animal = await getAnimalByIdRepository(id)
  return animal
}

export default getAnimalByIdUseCase
