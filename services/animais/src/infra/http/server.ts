import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'
const app = express()

// Middlewares essenciais
app.use(express.json())

// Acoplamento das rotas do microsserviço
app.use(routes)

// Middleware global para tratamento de erros (opcional, mas recomendado)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

export { app }
