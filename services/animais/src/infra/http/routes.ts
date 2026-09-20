import CreateAnimalController from '@controllers/animal/create-animal-controller'
import { HealthController, UpdateHealthController } from '@controllers/health'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

routes.post('/animais', CreateAnimalController)


export default routes
