import { Request, Response } from "express"
import { createZone, getAllZones, getZoneById, updateZone, deleteZone } from "./zone.service.js"

/**
 * Maneja la peticion POST y llama al servicio que lo crea
 * 
 * @param req.body - datos dentro del cuerpo de la peticion
 * @param res 201 registro exitoso de la zona
 * @throws 500 - error al crear la zona
 * @returns la zona creada
 */
export async function handleCreateZone(req: Request, res: Response) {
  try {

    const zone = await createZone(req.body)
    res.status(201).json(zone)

  } catch (error) {
    res.status(500).json({ error: "Error al crear registro de zona" })
  }
}

/**
 * Maneja la peticion GET y llama al servicio que trae todos los registros
 * 
 * @param res - 200 zonas obtenidas
 * @throws 500 - error al obtener todas las zonas
 * @returns todos los registros de zonas
 */
export async function handleGetAllZones(req: Request, res: Response) {
  try {

    const zones = await getAllZones()
    res.status(200).json(zones)

  } catch (error) {
    res.status(500).json({ error: "Error al obtener las zonas" })
  }
}

/**
 * Busca el registro que coincida con el id
 * 
 * @param req.params.id - id de la zona
 * @param res - 200 zona encontrada
 * @throws No obtiene la zona(500) o zona no encontrada(404)
 * @returns unico registro de zona
 */
export async function handleGetZoneById(req: Request, res: Response) {
  try {

    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    const zone = await getZoneById(id)

    if(!zone) {
      res.status(404).json({ error: "Zona no encontrada" })
      return
    }

    res.status(200).json(zone)

  } catch (error) {
    res.status(500).json({ error: "Error al obtener zona"})
  }
}

/**
 * Maneja la peticion PATCH que llama al servicio que actuliza la zona
 * 
 * @param req.params.id - id de la zona
 * @param res - 200 zona actualizada
 * @throws 500 - error al actualizar la zona
 * @returns la zona actualizada
 */
export async function handleUpdateZone(req: Request, res: Response) {
  try {
    
    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }
    const zone = await updateZone(id, req.body)
    res.status(200).json(zone)

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la zona"})
  }
}

/**
 * Maneja la peticion DELETE que llama al servicio que actuliza la zona
 * 
 * @param req.params.id - id de la zona
 * @param res - 204 eliminacion exitosa de la zona
 * @throws 500 - error al actualizar la zona
 * @returns - no hay body que devolver
 */
export async function handleDeleteZone(req: Request, res: Response) {
  try {

    const { id } = req.params

    if(typeof id !== "string") {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    await deleteZone(id)
    res.status(204).send()

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la zona" })
  }
}