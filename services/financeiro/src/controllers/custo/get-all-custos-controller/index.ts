import { HttpStatusCode } from '@infra/http/types'
import getAllCustosUseCase from '@use-cases/get-all-custos-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetAllCustosController = async (_req: Request, res: Response) => {
  const custos = await getAllCustosUseCase()
  logger.info('Custos listados', { quantidade: custos.length })
  return res.status(HttpStatusCode.OK).json(custos)
}

export default GetAllCustosController
