import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { AnimalNotFoundError } from '@repositories/get-animal-by-id/error'
import getAnimalByIdUseCase from '@use-cases/get-animal-by-id-usecase'
import { logger } from '@utils/logger'
import { Request, Response } from 'express'
import getAnimalByIdValidation from './validation'

const GetAnimalByIdController = async (req: Request, res: Response) => {
  const reqParam = req.params.id

  logger.info('Request de obtenção de animal por ID', { animalId: reqParam })
  
  const { id: animalId } = getAnimalByIdValidation(req.params)
  try {
    const animal = await getAnimalByIdUseCase(animalId)

    logger.info('Animal obtido com sucesso', { animal })
    
    return res.status(HttpStatusCode.OK).json(animal)
  } catch (error) {
    if (error instanceof AnimalNotFoundError) {
      logger.error('Animal não encontrado', { error })

      throw new HttpError('Animal não encontrado', {
        status: HttpStatusCode.NOT_FOUND,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default GetAnimalByIdController