import { Request, Response } from 'express'
import { createDeskAmenity, getDeskAmenity, deleteDeskAmenity } from './desk-amenity.service.js'

/**
 * Asigna un amenity a un puesto de trabajo.
 *
 * @route POST /desks/:deskId/amenities/:amenityId
 * @param req - Parámetros de ruta "deskId" y "amenityId"
 * @param res - 201 con la relación creada, 400 si los IDs son inválidos, o 500 si falla
 */
export async function handleCreateDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId, amenityId } = req.params

    if (typeof deskId !== 'string') {
      res.status(400).json({ error: 'deskId invalido' })
      return
    }
    if (typeof amenityId !== 'string') {
      res.status(400).json({ error: 'amenityId invalido' })
      return
    }

    const deskAmenity = await createDeskAmenity(deskId, amenityId)
    res.status(201).json(deskAmenity)
  } catch {
    res.status(500).json({ error: 'Error al crear relacion deskAmenity' })
  }
}

/**
 * Lista todos los amenities asignados a un puesto específico.
 *
 * @route GET /desks/:deskId/amenities
 * @param req - Parámetro de ruta "deskId"
 * @param res - 200 con la lista de amenities del desk, 400 si el ID es inválido, o 500 si falla
 */
export async function handleGetDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId } = req.params

    if (typeof deskId !== 'string') {
      res.status(400).json({ error: 'ID invalido' })
      return
    }

    const deskAmenity = await getDeskAmenity(deskId)
    res.status(200).json(deskAmenity)
  } catch {
    res.status(500).json({ error: 'Error al obtener deskAmenity' })
  }
}

/**
 * Elimina la asignación de un amenity a un puesto.
 *
 * @route DELETE /desks/:deskId/amenities/:amenityId
 * @param req - Parámetros de ruta "deskId" y "amenityId"
 * @param res - 204 sin contenido si se elimina, 400 si los IDs son inválidos, o 500 si falla
 */
export async function handleDeleteDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId, amenityId } = req.params

    if (typeof deskId !== 'string') {
      res.status(400).json({ error: 'deskId invalido' })
      return
    }
    if (typeof amenityId !== 'string') {
      res.status(400).json({ error: 'amenityId invalido' })
      return
    }

    await deleteDeskAmenity(deskId, amenityId)

    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Error al eliminar deskAmenity' })
  }
}
