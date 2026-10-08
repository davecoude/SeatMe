import { DeskStatus } from '../../../prisma/generated/prisma/client.js'
import { prisma } from '../../config/database.js'

/**
 * Crea un nuevo puesto de trabajo en el coworking.
 *
 * @param data - Datos del puesto a crear
 * @param data.code - Código identificador del puesto
 * @param data.zoneId - ID de la zona a la que pertenece el puesto
 * @param data.status - Estado inicial del puesto (AVAILABLE o MAINTENANCE)
 * @param data.posX - Coordenada X para renderizado en el mapa visual
 * @param data.posY - Coordenada Y para renderizado en el mapa visual
 * @returns El puesto creado con su ID generado
 */
export async function createDesk(data: {
  code: string
  zoneId: string
  status: DeskStatus
  posX: number
  posY: number
}) {
  const desk = await prisma.desk.create({ data })
  return desk
}

/**
 * Obtiene todos los puestos de trabajo registrados.
 * Incluye la información de la zona asociada a cada puesto.
 *
 * @returns Lista de puestos con su zona incluida
 */
export async function getAllDesks() {
  const desks = await prisma.desk.findMany({
    include: { zone: true },
  })
  return desks
}

/**
 * Busca un puesto de trabajo por su ID único.
 * Incluye la información de la zona asociada.
 *
 * @param id - ID único del puesto a buscar
 * @returns El puesto encontrado con su zona, o null si no existe
 */
export async function getDeskById(id: string) {
  const desk = await prisma.desk.findUnique({ where: { id }, include: { zone: true } })
  return desk
}

/**
 * Actualiza los datos de un puesto de trabajo existente.
 *
 * @param id - ID único del puesto a actualizar
 * @param data - Campos a modificar (solo se envían los que cambian)
 * @param data.code - Nuevo código identificador
 * @param data.zoneId - ID de la nueva zona (para reubicar el puesto)
 * @param data.status - Nuevo estado del puesto
 * @param data.posX - Nueva coordenada X
 * @param data.posY - Nueva coordenada Y
 * @returns El puesto actualizado
 * @throws Error si el puesto no existe
 */
export async function updateDesk(
  id: string,
  data: Partial<{ code: string; zoneId: string; status: DeskStatus; posX: number; posY: number }>,
) {
  const desk = await prisma.desk.update({ where: { id }, data })
  return desk
}

/**
 * Elimina un puesto de trabajo del sistema.
 *
 * @param id - ID único del puesto a eliminar
 * @returns El puesto eliminado
 * @throws Error si el puesto no existe o tiene reservas asociadas
 */
export async function deleteDesk(id: string) {
  const desk = await prisma.desk.delete({ where: { id } })
  return desk
}
