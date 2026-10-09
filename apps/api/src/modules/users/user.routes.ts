import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { handleUploadAvatar, handleGetProfile } from './user.controller.js'

const router = Router()

/**
 * Configura el middleware de Multer para validar y procesar imágenes.
 * 
 * Almacena los archivos temporalmente en memoria, limita su tamaño a 5 MB
 * y permite únicamente imágenes JPEG, PNG y WEBP.
*/
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']

    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imagenes JPG, PNG o WEBP'))
    }
  },
})

router.get('/me', authenticate, handleGetProfile)
router.post('/avatar', authenticate, upload.single('avatar'), handleUploadAvatar)

export default router
