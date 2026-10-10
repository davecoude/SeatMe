import { Request, Response } from 'express'
import { uploadAvatar, getUserProfile } from './user.service.js'

/**
 * Sube una imagen de avatar para el usuario autenticado.
 *
 * @route POST /users/avatar
 */
export async function handleUploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    if (!req.file) {
      res.status(400).json({ error: 'No se envio ninguna imagen' })
      return
    }

    const user = await uploadAvatar(userId, req.file)
    res.status(200).json(user)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al subir avatar'
    res.status(500).json({ error: msg })
  }
}

/**
 * Obtiene el perfil del usuario autenticado.
 *
 * @route GET /users/me
 */
export async function handleGetProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    const user = await getUserProfile(userId)
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.status(200).json(user)
  } catch {
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}
