import { Animal } from '@repositories/create-animal/types'
import getAnimalByIdRepository from '@repositories/get-animal-by-id'

const getAnimalByIdUseCase = async (
  id: string
): Promise<Animal> => {
  const animal = await getAnimalByIdRepository(id)
  return animal
}

export default getAnimalByIdUseCase