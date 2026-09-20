import getAllAnimalsRepository from '@repositories/get-all-animals'

const getAllAnimalsUseCase = async () => {
  return await getAllAnimalsRepository()
}

export default getAllAnimalsUseCase