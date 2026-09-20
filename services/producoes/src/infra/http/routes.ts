import { HealthController, UpdateHealthController } from '@controllers/health'
import CreateProducaoController from '@controllers/producao/create-producao-controller'
import GetAllProducoesController from '@controllers/producao/get-all-producoes-controller'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

routes.get('/producoes', GetAllProducoesController)
routes.post('/producoes', CreateProducaoController)

export default routes
