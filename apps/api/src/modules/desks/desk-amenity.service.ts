import { prisma } from "../../config/database.js"


/**
 * Asigna un amenity a un puesto de trabajo.
 * Crea la relación en la tabla pivote DeskAmenity.
 *
 * @param deskId - ID del puesto al que se asigna el amenity
 * @param amenityId - ID del amenity a asignar
 * @returns La relación creada con ambos IDs
 * @throws Error si el desk o amenity no existen, o si la relación ya existe
 */
export async function createDeskAmenity( deskId: string, amenityId: string) {
  const deskAmenity = await prisma.deskAmenity.create({
    data: {
      deskId: deskId,
      amenityId: amenityId
    }
  })

  return deskAmenity
}

/**
 * Obtiene todos los amenities asignados a un puesto específico.
 * Incluye los datos completos de cada amenity.
 *
 * @param deskId - ID del puesto cuyos amenities se consultan
 * @returns Lista de relaciones con los datos del amenity incluidos
 */
export async function getDeskAmenity(id: string) {
  const deskAmenities = await prisma.deskAmenity.findMany({
    where: { deskId: id },
    include: { amenity: true }
  })

  return deskAmenities
}

/**
 * Elimina la asignación de un amenity a un puesto.
 * Usa la llave compuesta deskId + amenityId para identificar la relación.
 *
 * @param deskId - ID del puesto
 * @param amenityId - ID del amenity a desasignar
 * @returns La relación eliminada
 * @throws Error si la relación no existe
 */
export async function deleteDeskAmenity(deskId: string, amenityId: string) {

  const deskAmenity = await prisma.deskAmenity.delete({
    where: {
      deskId_amenityId: {
        deskId: deskId,
        amenityId: amenityId
      }
    }
  })

  return deskAmenity
}