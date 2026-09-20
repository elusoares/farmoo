import { HttpStatusCode } from '@infra/http/types'
import getAllProducoesUseCase from '@use-cases/get-all-producoes-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetAllProducoesController = async (_req: Request, res: Response) => {
  logger.info('Obtendo todas as produções')
  const producoes = await getAllProducoesUseCase()
  res.status(HttpStatusCode.OK).json(producoes)
}

export default GetAllProducoesController