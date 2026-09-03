import { Request, Response } from "express"
import { createAmenity, getAllAmenities, getAmenityById, updateAmenity, deleteAmenity } from "./amenities.service.js"


/**
 * Maneja la creación de un nuevo amenity.
 *
 * @route POST /amenities
 * @param req - Body con name e icon
 * @param res - 201 con el amenity creado, o 500 si falla
 */
export async function handleCreateAmenity(req: Request, res: Response) {
  try {
    const amenity = await createAmenity(req.body)
    res.status(201).json(amenity)

  } catch (error) {
    res.status(500).json({ error: "Error al crear amenity" })
  }
}


/**
 * Devuelve todos los amenities registrados.
 *
 * @route GET /amenities
 * @param req - Sin parámetros requeridos
 * @param res - 200 con la lista de amenities, o 500 si falla
 */
export async function handleGetAllAmenities(req: Request, res: Response) {
  try {
    const amenities = await getAllAmenities()
    res.status(200).json(amenities)

  } catch (error) {
    res.status(500).json({ error: "Error al obtener los amenities"})
  }
}

/**
 * Busca y devuelve un amenity por su ID.
 *
 * @route GET /amenities/:id
 * @param req - Parámetro de ruta "id"
 * @param res - 200 con el amenity, 404 si no existe, 400 si el ID es inválido, o 500 si falla
 */
export async function handleGetAmenityById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    const amenity = await getAmenityById(id)

    if(!amenity) {
      res.status(404).json({ error: "Amenity no encontrado" })
      return
    }

    res.status(200).json(amenity)

    
  } catch (error) {
    res.status(500).json({ error: "Error al obtener amenity" })
  }
}


/**
 * Actualiza parcialmente un amenity existente.
 *
 * @route PATCH /amenities/:id
 * @param req - Parámetro "id" en ruta, campos a actualizar en body
 * @param res - 200 con el amenity actualizado, 400 si el ID es inválido, o 500 si falla
 */
export async function handleUpdateAmenity(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    const updatedAmenity = await updateAmenity(id, req.body)
    res.status(200).json(updatedAmenity)

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar amenity"})
  }
}

/**
 * Elimina un amenity del sistema.
 *
 * @route DELETE /amenities/:id
 * @param req - Parámetro de ruta "id"
 * @param res - 204 sin contenido si se elimina, 400 si el ID es inválido, o 500 si falla
 */
export async function handleDeleteAmenity(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    await deleteAmenity(id)
    res.status(204).send()

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el amenity" })
  }
}