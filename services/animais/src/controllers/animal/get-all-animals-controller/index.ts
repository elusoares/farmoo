
import { HttpStatusCode } from '@infra/http/types'
import getAllAnimalsUseCase from '@use-cases/get-all-animals-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetAllAnimalsController = async (_req: Request, res: Response) => {
  logger.info('Obtendo todos os animais')
  const animals = await getAllAnimalsUseCase()
  res.status(HttpStatusCode.OK).json(animals)
}

export default GetAllAnimalsController