import { ValidationError } from '@infra/http/errors'
import logger from '@utils/logger'
import { z } from 'zod'
import { UpdateHealthBody } from './types'

const updateHealthBodySchema: z.ZodType<UpdateHealthBody> = z
  .object({
    healthy: z.boolean(),
  })
  .strict()

export const validateUpdateHealthBody = (data: unknown): UpdateHealthBody => {
  const result = updateHealthBodySchema.safeParse(data)

  if (!result.success) {
    logger.warn('Falha na validação da request', result.error)
    throw new ValidationError('Dados inválidos', z.treeifyError(result.error))
  }

  return result.data
}
