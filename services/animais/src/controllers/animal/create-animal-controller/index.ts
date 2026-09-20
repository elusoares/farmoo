import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { AnimalCreationError } from '@repositories/create-animal/errors'
import createAnimalUseCase from '@use-cases/create-animal-usecase'
import { logger } from '@utils/logger'
import { Request, Response } from 'express'
import createAnimalValidation from './validation'

const CreateAnimalController = async (req: Request, res: Response) => {
  logger.info('Request de criação de animal', {
    body: req.body,
  })
  const validatedBody = createAnimalValidation(req.body)
  try {
    const animal = await createAnimalUseCase(validatedBody)

    logger.info('Animal criado', { animalId: animal.id })
    
    return res.status(HttpStatusCode.CREATED).json(animal)
  } catch (error) {
    if (error instanceof AnimalCreationError) {
      logger.error('Erro ao criar animal ', error)

      throw new HttpError('Não foi possível criar o animal', {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default CreateAnimalController
