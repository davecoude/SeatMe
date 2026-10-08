import { prisma } from '../../config/database.js'

/**
 * Crea un registro para la tabla Zone con los campos definidos
 *
 * @param data - datos de la zona a crear
 * @param data.name - nombre identificador de la zona
 * @param data.description - descripcion opcional de la zona
 * @param data.floor - numero de piso donde su ubica la zona
 * @returns la zona creada con su ID generado
 */
export async function createZone(data: { name: string; description?: string; floor: number }) {
  const zone = await prisma.zone.create({ data })
  return zone
}

/**
 * Trae todos los registros de la tabla Zone
 *
 * @returns todos los registros de zonas
 */
export async function getAllZones() {
  const zones = await prisma.zone.findMany()
  return zones
}

/**
 * Buscar por un campo unico
 *
 * @param id - campo identificador para buscar el registro
 * @returns el registro encontrado con su respectivo id
 */
export async function getZoneById(id: string) {
  const zone = prisma.zone.findUnique({ where: { id } })
  return zone
}

/**
 * Actualizar una zona existente
 *
 * @param id - identificador que actualiza el registro
 * @param data - datos de la zona opcionales
 * @param data.name - nombre de la zona
 * @param data.description - descripcion opcional de la zona
 * @param data.floor - numero de piso de la zona
 * @returns la zona con los datos actualizados
 */
export async function updateZone(
  id: string,
  data: Partial<{ name: string; description: string; floor: number }>,
) {
  const zone = prisma.zone.update({ where: { id }, data })
  return zone
}

/**
 * Eliminar un registro segun id
 *
 * @param id - identificador de la zona
 * @returns devuelve el registro de zona eliminado
 */
export async function deleteZone(id: string) {
  const zone = prisma.zone.delete({ where: { id } })
  return zone
}
