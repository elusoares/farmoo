import { ValidationError } from '@infra/http/errors'
import { logger } from '@utils/logger'
import { z } from 'zod'
import { CreateAnimalBody } from './types'

const createAnimalBaseSchema = {
  tipo: z.string().trim().min(1).max(50),
  nome: z.string().trim().min(1).max(100),
}

const createAnimalBodySchema: z.ZodType<CreateAnimalBody> = z.discriminatedUnion('origem', [
  z
    .object({
      ...createAnimalBaseSchema,
      origem: z.literal('comprado'),
      valorCompra: z.number().min(0).max(99_999_999.99),
      dataCompra: z.iso.date(),
    })
    .strict(),
  z
    .object({
      ...createAnimalBaseSchema,
      origem: z.literal('nascido'),
      dataNascimento: z.iso.date(),
      maeId: z.number().int().positive(),
      paiId: z.number().int().positive().optional(),
    })
    .strict(),
])

const createAnimalValidation = (data: unknown): CreateAnimalBody => {
  const result = createAnimalBodySchema.safeParse(data)

  if (!result.success) {
    logger.warn('Falha na validação da request', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}

export default createAnimalValidation
