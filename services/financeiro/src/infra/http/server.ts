import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import logger from '@utils/logger'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(routes)

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, details: error.details })
    return
  }

  logger.error('Erro não tratado durante a requisição', error)
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
})

export { app }
