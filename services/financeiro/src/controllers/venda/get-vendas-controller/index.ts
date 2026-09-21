import { HttpStatusCode } from '@infra/http/types'
import getVendasUseCase from '@use-cases/get-vendas-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetVendasController = async (_req: Request, res: Response) => {
  const vendas = await getVendasUseCase()
  logger.info('Vendas listadas', { quantidade: vendas.length })
  return res.status(HttpStatusCode.OK).json(vendas)
}

export default GetVendasController
