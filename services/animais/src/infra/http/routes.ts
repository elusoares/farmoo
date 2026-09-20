import { healthController, updateHealthController } from '@controllers/health'
import { Router } from 'express'

const routes = Router()

routes.get('/health', healthController)
routes.patch('/health', updateHealthController)

export default routes
