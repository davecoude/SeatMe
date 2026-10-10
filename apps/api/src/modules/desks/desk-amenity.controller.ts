import { Request, Response } from 'express'
import { createDeskAmenity, getDeskAmenity, deleteDeskAmenity } from './desk-amenity.service.js'
import { DeskParamsSchema, DeskAmenityParamsSchema } from './desk-amenity.schema.js'
import { sendError } from '../../utils/send-error.js'

/**
 * Asigna un amenity a un puesto de trabajo.
 *
 * @route POST /desks/:deskId/amenities/:amenityId
 * @param req - Parámetros de ruta "deskId" y "amenityId" (validados con DeskAmenityParamsSchema)
 * @param res - 201 con la relación creada, 400 si los IDs son inválidos,
 *              404 si el desk o el amenity no existen, 409 si ya estaba asignado, o 500 si falla
 */
export async function handleCreateDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId, amenityId } = DeskAmenityParamsSchema.parse(req.params)

    const deskAmenity = await createDeskAmenity(deskId, amenityId)
    res.status(201).json(deskAmenity)
  } catch (error) {
    sendError(res, error, 'Error al crear relacion deskAmenity', {
      P2003: { status: 404, message: 'El desk o el amenity no existen' },
      P2002: { status: 409, message: 'El amenity ya esta asignado a este desk' },
    })
  }
}

/**
 * Lista todos los amenities asignados a un puesto específico.
 *
 * @route GET /desks/:deskId/amenities
 * @param req - Parámetro de ruta "deskId" (validado con DeskParamsSchema)
 * @param res - 200 con la lista de amenities del desk, 400 si el ID es inválido, o 500 si falla
 */
export async function handleGetDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId } = DeskParamsSchema.parse(req.params)

    const deskAmenity = await getDeskAmenity(deskId)
    res.status(200).json(deskAmenity)
  } catch (error) {
    sendError(res, error, 'Error al obtener deskAmenity')
  }
}

/**
 * Elimina la asignación de un amenity a un puesto.
 *
 * @route DELETE /desks/:deskId/amenities/:amenityId
 * @param req - Parámetros de ruta "deskId" y "amenityId" (validados con DeskAmenityParamsSchema)
 * @param res - 204 sin contenido si se elimina, 400 si los IDs son inválidos,
 *              404 si la asignación no existe, o 500 si falla
 */
export async function handleDeleteDeskAmenity(req: Request, res: Response) {
  try {
    const { deskId, amenityId } = DeskAmenityParamsSchema.parse(req.params)

    await deleteDeskAmenity(deskId, amenityId)

    res.status(204).send()
  } catch (error) {
    sendError(res, error, 'Error al eliminar deskAmenity', {
      P2025: { status: 404, message: 'El amenity no esta asignado a este desk' },
    })
  }
}
