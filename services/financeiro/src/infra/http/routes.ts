import CreateCustoController from '@controllers/custo/create-custo-controller'
import GetAllCustosController from '@controllers/custo/get-all-custos-controller'
import { HealthController, UpdateHealthController } from '@controllers/health'
import GetResultadoController from '@controllers/resultado/get-resultado-controller'
import GetVendasController from '@controllers/venda/get-vendas-controller'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

routes.post('/custos', CreateCustoController)
routes.get('/custos', GetAllCustosController)

routes.get('/resultado', GetResultadoController)

routes.get('/vendas', GetVendasController)

export default routes
