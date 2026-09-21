import { HttpStatusCode } from '@infra/http/types'
import getResultadoUseCase from '@use-cases/get-resultado-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'

const GetResultadoController = async (_req: Request, res: Response) => {
  const resultado = await getResultadoUseCase()
  logger.info('Resultado por animal calculado', { quantidade: resultado.length })
  return res.status(HttpStatusCode.OK).json(resultado)
}

export default GetResultadoController
