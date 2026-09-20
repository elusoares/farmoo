import { HealthController, UpdateHealthController } from '@controllers/health'
import { Router } from 'express'

const routes = Router()

routes.get('/health', HealthController)
routes.patch('/health', UpdateHealthController)

export default routes
