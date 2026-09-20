import { HttpStatusCode } from '@infra/http/types'
import { logger } from '@utils/logger'
import { Request, Response } from 'express'
import { validateUpdateHealthBody } from './validation'

let isHealthy = true

const HealthController = (_req: Request, res: Response) => {
  const statusCode = isHealthy ? HttpStatusCode.OK : HttpStatusCode.SERVICE_UNAVAILABLE

  logger.info('Health check solicitado', { healthy: isHealthy })
  res.status(statusCode).json({
    status: isHealthy ? 'ok' : 'unavailable',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
}

const UpdateHealthController = (req: Request, res: Response) => {
  const body = validateUpdateHealthBody(req.body)

  isHealthy = body.healthy
  logger.info('Health status atualizado', { healthy: isHealthy })
  res.status(HttpStatusCode.OK).json({ status: isHealthy ? 'ok' : 'unavailable' })
}

export { HealthController, UpdateHealthController }
