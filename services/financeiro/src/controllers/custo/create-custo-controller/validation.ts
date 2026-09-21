import { ValidationError } from '@infra/http/errors'
import logger from '@utils/logger'
import { z } from 'zod'
import { CreateCustoBody } from './types'

const createCustoBodySchema: z.ZodType<CreateCustoBody> = z
  .object({
    tipo: z.string().trim().min(1).max(50),
    descricao: z.string().trim().min(1).optional(),
    valor: z.number().nonnegative().max(99_999_999.99),
    data: z.iso.date(),
    animalId: z.number().int().positive().optional(),
  })
  .strict()

const createCustoValidation = (data: unknown): CreateCustoBody => {
  const result = createCustoBodySchema.safeParse(data)

  if (!result.success) {
    logger.warn('Falha na validação da request de criação de custo', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}

export default createCustoValidation
