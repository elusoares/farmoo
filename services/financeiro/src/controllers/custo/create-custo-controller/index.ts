import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import { CustoCreationError } from '@repositories/create-custo/errors'
import createCustoUseCase from '@use-cases/create-custo-usecase'
import logger from '@utils/logger'
import { Request, Response } from 'express'
import createCustoValidation from './validation'

const CreateCustoController = async (req: Request, res: Response) => {
  logger.info('Request de criação de custo', { body: req.body })
  const validatedBody = createCustoValidation(req.body)

  try {
    const custo = await createCustoUseCase(validatedBody)
    logger.info('Custo criado', { custoId: custo.id })
    return res.status(HttpStatusCode.CREATED).json(custo)
  } catch (error) {
    if (error instanceof CustoCreationError) {
      logger.error('Erro ao criar custo', error)
      throw new HttpError('Não foi possível criar o custo', {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        details: { code: error.code },
      })
    }

    throw error
  }
}

export default CreateCustoController
