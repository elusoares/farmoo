import { ValidationError } from '@infra/http/errors'
import logger from '@utils/logger'
import { z } from 'zod'
import { CreateProducaoBody } from './types'

const createProducaoBodySchema: z.ZodType<CreateProducaoBody> = z
  .object({
    animalId: z.number().int().positive(),
    tipo: z.string().trim().min(1).max(50),
    quantidade: z.number().positive().max(99_999_999.99),
    unidade: z.string().trim().min(1).max(20),
    data: z.iso.date(),
  })
  .strict()

const createProducaoValidation = (data: unknown): CreateProducaoBody => {
  const result = createProducaoBodySchema.safeParse(data)

  if (!result.success) {
    logger.warn('Falha na validação da request de criação de produção', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}

export default createProducaoValidation
