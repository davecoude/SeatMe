import { Router } from 'express'
import {
  handleCreateDesk,
  handleGetAllDesks,
  handleGetDeskById,
  handleUpdateDesk,
  handleDeleteDesk,
} from './desks.controller.js'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authenticate, authorize(['ADMIN']), handleCreateDesk)
router.get('/', authenticate, handleGetAllDesks)
router.get('/:id', authenticate, handleGetDeskById)
router.patch('/:id', authenticate, authorize(['ADMIN']), handleUpdateDesk)
router.delete('/:id', authenticate, authorize(['ADMIN']), handleDeleteDesk)

export default router
