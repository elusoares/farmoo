import { HttpStatusCode } from '@infra/http/types'
import getAllProducoesEstoqueUseCase from '@use-cases/get-all-producoes-estoque'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetAllProducoesEstoqueController = async (_req: Request, res: Response) => {
  logger.info('Obtendo o estoque de produções')
  const producoesEstoque = await getAllProducoesEstoqueUseCase()
  res.status(HttpStatusCode.OK).json(producoesEstoque)
}

export default GetAllProducoesEstoqueController