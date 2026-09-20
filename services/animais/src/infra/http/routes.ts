import CreateAnimalController from '@controllers/animal/create-animal-controller'
import GetAllAnimalsController from '@controllers/animal/get-all-animals-controller'
import GetAnimalByIdController from '@controllers/animal/get-animal-by-id-controller'
import { HealthController, UpdateHealthController } from '@controllers/health'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

routes.post('/animais', CreateAnimalController)
routes.get('/animais/:id', GetAnimalByIdController)
routes.get('/animais/', GetAllAnimalsController)


export default routes
