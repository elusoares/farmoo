import { ValidationError } from '@infra/http/errors'
import logger from '@utils/logger'
import { z } from 'zod'
import { SellAnimalRequest } from './types'

const sellAnimalRequestSchema: z.ZodType<SellAnimalRequest> = z
  .object({
    id: z.string().regex(/^\d+$/),
    valorVenda: z.number().min(0).max(99_999_999.99),
    dataVenda: z.iso.date(),
  })
  .strict()

const sellAnimalValidation = (sellData: unknown): SellAnimalRequest => {
  const result = sellAnimalRequestSchema.safeParse(sellData)

  if (!result.success) {
    logger.warn('Falha na validação da request de venda de animal', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}

export default sellAnimalValidation
