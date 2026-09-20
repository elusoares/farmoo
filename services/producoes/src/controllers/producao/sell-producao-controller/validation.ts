import { ValidationError } from '@infra/http/errors'
import logger from '@utils/logger'
import { z } from 'zod'
import { SellProducaoRequest } from './types'

const sellProducaoRequestSchema: z.ZodType<SellProducaoRequest> = z
  .object({
    id: z.string().regex(/^\d+$/),
    valorVenda: z.number().min(0).max(99_999_999.99),
    dataVenda: z.iso.date(),
  })
  .strict()

const sellProducaoValidation = (sellData: unknown): SellProducaoRequest => {
  const result = sellProducaoRequestSchema.safeParse(sellData)

  if (!result.success) {
    logger.warn('Falha na validação da request de venda de produção', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}

export default sellProducaoValidation
