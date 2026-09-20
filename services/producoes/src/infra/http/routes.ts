import { HealthController, UpdateHealthController } from '@controllers/health'
import CreateProducaoController from '@controllers/producao/create-producao-controller'
import GetAllProducoesEstoqueController from '@controllers/producao/get-all-producoes--estoque-controller'
import GetAllProducoesController from '@controllers/producao/get-all-producoes-controller'
import SellProducaoController from '@controllers/producao/sell-producao-controller'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

routes.get('/producoes', GetAllProducoesController)
routes.post('/producoes', CreateProducaoController)

routes.get('/producoes/estoque', GetAllProducoesEstoqueController)
routes.patch('/producoes/:id/venda', SellProducaoController)

export default routes
