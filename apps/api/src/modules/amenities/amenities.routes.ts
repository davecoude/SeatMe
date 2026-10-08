import { Router } from 'express'
import {
  handleCreateAmenity,
  handleGetAllAmenities,
  handleGetAmenityById,
  handleUpdateAmenity,
  handleDeleteAmenity,
} from './amenities.controller.js'
import { authenticate, authorize } from '../../middlewares/auth.middleware.js'

/** Router del módulo de amenities */
const router = Router()

router.post('/', authenticate, authorize(['ADMIN']), handleCreateAmenity)
router.get('/', authenticate, handleGetAllAmenities)
router.get('/:id', authenticate, handleGetAmenityById)
router.patch('/:id', authenticate, authorize(['ADMIN']), handleUpdateAmenity)
router.delete('/:id', authenticate, authorize(['ADMIN']), handleDeleteAmenity)

export default router
