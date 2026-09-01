import { Request, Response } from "express"
import { createDesk, getAllDesks, getDeskById, updateDesk, deleteDesk } from "./desks.service.js"


/**
 * Maneja la creación de un nuevo puesto de trabajo.
 * Extrae los datos del body y delega al service.
 *
 * @route POST /desks
 * @param req - Body con code, zoneId, status, posX, posY
 * @param res - 201 con el puesto creado, o 500 si falla
 */
export async function handleCreateDesk(req: Request, res: Response) {
  try {

    const desk = await createDesk(req.body)
    res.status(201).json(desk)
    
  } catch (error) {
    res.status(500).json({ error: "Error al crear desk"})
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
  } catch (error) {
    res.status(500).json({ error: "Error al obtener todos los registros"})
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

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const desk = await getDeskById(id)

    if(!desk) {
      res.status(404).json({ error: "desk no encontrado"})
      return
    }

    res.status(200).json(desk)

  } catch (error) {
    res.status(500).json({ error: "Error al obtener desk"})
  }
}

/**
 * Actualiza parcialmente un puesto de trabajo existente.
 *
 * @route PATCH /desks/:id
 * @param req - Parámetro "id" en ruta, campos a actualizar en body
 * @param res - 200 con el puesto actualizado, 400 si el ID es inválido, o 500 si falla
 */
export async function handleUpdateDesk(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const desk = await updateDesk(id, req.body)
    res.status(200).json(desk)

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar desk"})
  }
}

/**
 * Elimina un puesto de trabajo del sistema.
 *
 * @route DELETE /desks/:id
 * @param req - Parámetro de ruta "id"
 * @param res - 204 sin contenido si se elimina, 400 si el ID es inválido, o 500 si falla
 */
export async function handleDeleteDesk(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    await deleteDesk(id)
    res.status(204).send()

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar desk"})
  }
}