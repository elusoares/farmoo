import { app } from './infra/http/server'

// Uma boa prática é isolar a porta em variáveis de ambiente
const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`🚀 Microsserviço rodando na porta ${PORT}`)
})
