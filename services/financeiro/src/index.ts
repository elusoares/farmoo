import { testConnection } from '@config/database'
import { ENV } from '@config/env'
import { app } from '@infra/http/server'

const bootstrap = async () => {
  await testConnection()
  app.listen(ENV.port, () => {
    console.log(`🚀 Microsserviço 'financeiro' rodando na porta ${ENV.port}`)
  })
}

console.log('⏳ Aguardando o container do banco iniciar...')
setTimeout(() => void bootstrap(), 3_000)
