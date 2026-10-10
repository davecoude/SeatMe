import { Request, Response } from 'express'
import { createDesk, getAllDesks, getDeskById, updateDesk, deleteDesk } from './desks.service.js'
import { CreateDeskSchema, UpdateDeskSchema } from './desk.schema.js'
import { sendError } from '../../utils/send-error.js'

/** Error cuando el zoneId enviado no corresponde a ninguna zona */
const ZONE_NOT_FOUND = { status: 400, message: 'La zona indicada no existe' }

/**
 * Maneja la creación de un nuevo puesto de trabajo.
 * Valida el body con CreateDeskSchema y delega al service.
 *
 * @route POST /desks
 * @param req - Body con code, zoneId, status, posX, posY
 * @param res - 201 con el puesto creado, 400 si los datos o la zona son inválidos, o 500 si falla
 */
export async function handleCreateDesk(req: Request, res: Response) {
  try {
    const data = CreateDeskSchema.parse(req.body)
    const desk = await createDesk(data)
    res.status(201).json(desk)
  } catch (error) {
    sendError(res, error, 'Error al crear desk', { P2003: ZONE_NOT_FOUND })
  }
}

/**
 * Devuelve todos los puestos de trabajo con su zona asociada.
 *
 * @route GET /desks
 * @param req - Sin parámetros requeridos
 * @param res - 200 con la lista de puestos, o 500 si falla
 */
export async function handleGetAllDesks(req: Request, res: Response) {
  try {
    const desk = await getAllDesks()
    res.status(200).json(desk)
  } catch {
    res.status(500).json({ error: 'Error al obtener todos los registros' })
  }
}

/**
 * Busca y devuelve un puesto de trabajo por su ID.
 *
 * @route GET /desks/:id
 * @param req - Parámetro de ruta "id"
 * @param res - 200 con el puesto, 404 si no existe, 400 si el ID es inválido, o 500 si falla
 */
export async function handleGetDeskById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID invalido' })
      return
    }

    const desk = await getDeskById(id)

    if (!desk) {
      res.status(404).json({ error: 'desk no encontrado' })
      return
    }

    res.status(200).json(desk)
  } catch {
    res.status(500).json({ error: 'Error al obtener desk' })
  }
}

/**
 * Actualiza parcialmente un puesto de trabajo existente.
 *
 * @route PATCH /desks/:id
 * @param req - Parámetro "id" en ruta, campos a actualizar en body (validados con UpdateDeskSchema)
 * @param res - 200 con el puesto actualizado, 400 si los datos o la zona son inválidos,
 *              404 si el puesto no existe, o 500 si falla
 */
export async function handleUpdateDesk(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID invalido' })
      return
    }

    const data = UpdateDeskSchema.parse(req.body)
    const desk = await updateDesk(id, data)
    res.status(200).json(desk)
  } catch (error) {
    sendError(res, error, 'Error al actualizar desk', {
      P2025: { status: 404, message: 'desk no encontrado' },
      P2003: ZONE_NOT_FOUND,
    })
  }
}

/**
 * Elimina un puesto de trabajo del sistema.
 *
 * @route DELETE /desks/:id
 * @param req - Parámetro de ruta "id"
 * @param res - 204 sin contenido si se elimina, 400 si el ID es inválido, 404 si no existe,
 *              409 si tiene reservas o amenidades asociadas, o 500 si falla
 */
export async function handleDeleteDesk(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'ID invalido' })
      return
    }

    await deleteDesk(id)
    res.status(204).send()
  } catch (error) {
    sendError(res, error, 'Error al eliminar desk', {
      P2025: { status: 404, message: 'desk no encontrado' },
      P2003: {
        status: 409,
        message: 'No se puede eliminar el escritorio porque tiene reservas o amenidades asociadas',
      },
    })
  }
}
