import { prisma } from "../../config/database.js"

/**
 * Crea un nuevo amenity en el sistema.
 *
 * @param data - Datos del amenity a crear
 * @param data.name - Nombre descriptivo del amenity (ej: "Monitor 4K", "Standing Desk")
 * @param data.icon - Identificador del ícono para renderizado en frontend
 * @returns El amenity creado con su ID generado
 */
export async function createAmenity(data: {
  name: string,
  icon: string
}) {
  const amenity = await prisma.amenity.create({ data })
  return amenity
}

/**
 * Obtiene todos los amenities registrados en el sistema.
 *
 * @returns Lista completa de amenities
 */
export async function getAllAmenities() {
  const amenities = await prisma.amenity.findMany()
  return amenities
}

/**
 * Busca un amenity por su ID único.
 *
 * @param id - ID único del amenity a buscar
 * @returns El amenity encontrado, o null si no existe
 */
export async function getAmenityById(id: string) {
  const amenity = await prisma.amenity.findUnique({ where: { id }})
  return amenity 
}

/**
 * Actualiza los datos de un amenity existente.
 *
 * @param id - ID único del amenity a actualizar
 * @param data - Campos a modificar
 * @param data.name - Nuevo nombre del amenity
 * @param data.icon - Nuevo ícono del amenity
 * @returns El amenity actualizado
 * @throws Error si el amenity no existe
 */
export async function updateAmenity(id: string, data: Partial<{ name: string, icon: string}>) {
  const updatedAmenity = await prisma.amenity.update({ where: { id }, data })
  return updatedAmenity
}

/**
 * Elimina un amenity del sistema.
 *
 * @param id - ID único del amenity a eliminar
 * @returns El amenity eliminado
 * @throws Error si el amenity no existe o tiene relaciones con desks
 */
export async function deleteAmenity(id: string) {
  const deletedAmenity = await prisma.amenity.delete({ where: { id }})
  return deletedAmenity
}