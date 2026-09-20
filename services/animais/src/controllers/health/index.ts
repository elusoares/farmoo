import { HttpStatusCode } from '@infra/http/types'
import { Request, Response } from 'express'
import { validateUpdateHealthBody } from './validation'

let isHealthy = true

const healthController = (_req: Request, res: Response) => {
  const statusCode = isHealthy ? HttpStatusCode.OK : HttpStatusCode.SERVICE_UNAVAILABLE

  res.status(statusCode).json({
    status: isHealthy ? 'ok' : 'unavailable',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
}

const updateHealthController = (req: Request, res: Response) => {
  const body = validateUpdateHealthBody(req.body)

  isHealthy = body.healthy
  res.status(HttpStatusCode.OK).json({ status: isHealthy ? 'ok' : 'unavailable' })
}

export { healthController, updateHealthController }
