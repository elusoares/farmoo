import { HttpError } from '@infra/http/errors'
import { HttpStatusCode } from '@infra/http/types'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'
const app = express()

// Middlewares essenciais
app.use(express.json())

// Acoplamento das rotas do microsserviço
app.use(routes)

// Middleware global para tratamento de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details })
    return
  }

  console.error(err.stack)
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
})

export { app }
