import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { ProducaoUpdateNotFoundError } from '@repositories/update-producao/errors'
import sellProducaoUseCase from '@use-cases/sell-producao-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'
import sellProducaoValidation from './validation'

const SellProducaoController = async (req: Request, res: Response) => {
  const id = req.params.id
  const body = req.body
  logger.info('Request de venda de producao', {
    producaoId: id,
    body: body,
  })

  const {
    id: producaoId,
    valorVenda,
    dataVenda,
  } = sellProducaoValidation({ id, ...body})

  try {
    const producao = await sellProducaoUseCase({
      id: producaoId,
      valorVenda,
      dataVenda,
    })

    logger.info('Produção vendida', { producaoId })
    return res.status(HttpStatusCode.OK).json(producao)
  } catch (error) {
    if (error instanceof ProducaoUpdateNotFoundError) {
      logger.warn('Produção não encontrada para venda', { producaoId })
      throw new HttpError('Produção não encontrada', {
        status: HttpStatusCode.NOT_FOUND,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default SellProducaoController
