import { testConnection } from '@config/database'
import { ENV } from '@config/env'
import { app } from '@infra/http/server'

const PORT = ENV.port

const bootstrap = async () => {
  
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🚀 Microsserviço 'producoes' rodando na porta ${PORT}`)
  })
}

// Aguarda o container do banco iniciar antes de tentar a conexão
console.log("⏳ Aguardando o container do banco iniciar...")
setTimeout(bootstrap, 3000);

