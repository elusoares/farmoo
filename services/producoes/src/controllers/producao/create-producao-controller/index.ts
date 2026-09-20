import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { ProducaoCreationError } from '@repositories/create-producao/errors'
import createProducaoUseCase from '@use-cases/create-producao-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'
import createProducaoValidation from './validation'

const CreateProducaoController = async (req: Request, res: Response) => {
  logger.info('Request de criação de produção', {
    body: req.body,
  })
  const validatedBody = createProducaoValidation(req.body)

  try {
    const producao = await createProducaoUseCase(validatedBody)

    logger.info('Produção criada', { producaoId: producao.id })

    return res.status(HttpStatusCode.CREATED).json(producao)
  } catch (error) {
    if (error instanceof ProducaoCreationError) {
      logger.error('Erro ao criar produção', error)

      throw new HttpError('Não foi possível criar a produção', {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default CreateProducaoController
