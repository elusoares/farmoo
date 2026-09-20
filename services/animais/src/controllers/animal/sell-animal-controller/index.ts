import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { AnimalUpdateNotFoundError } from '@repositories/update-animal/errors'
import sellAnimalUseCase from '@use-cases/sell-animal-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'
import sellAnimalValidation from './validation'

const SellAnimalController = async (req: Request, res: Response) => {
  const id = req.params.id
  const body = req.body
  logger.info('Request de venda de animal', {
    animalId: id,
    body: body,
  })

  const {
    id: animalId,
    valorVenda,
    dataVenda,
  } = sellAnimalValidation({ id, ...body})

  try {
    const animal = await sellAnimalUseCase({
      id: animalId,
      valorVenda,
      dataVenda,
    })

    logger.info('Animal vendido', { animalId })
    return res.status(HttpStatusCode.OK).json(animal)
  } catch (error) {
    if (error instanceof AnimalUpdateNotFoundError) {
      logger.warn('Animal não encontrado para venda', { animalId })
      throw new HttpError('Animal não encontrado', {
        status: HttpStatusCode.NOT_FOUND,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default SellAnimalController
