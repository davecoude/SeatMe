import api from './api'

/**
 * Obtiene todos los escritorios registrados en el sistema.
 *
 * @returns Lista de escritorios.
 */
export async function fetchDesks() {
  const response = await api.get('/desks')
  return response.data
}

/**
 * Obtiene las amenidades asociadas a un escritorio.
 *
 * @param deskId - Identificador del escritorio.
 *
 * @returns Lista de amenidades asociadas al escritorio.
 */
export async function fetchDeskAmenities(deskId: string) {
  const response = await api.get(`/desks/${deskId}/amenities`)
  return response.data
}

/**
 * Crea un nuevo escritorio en el sistema.
 *
 * @param data - Datos necesarios para crear el escritorio.
 * @param data.code - Código identificador del escritorio.
 * @param data.zoneId - Identificador de la zona a la que pertenece.
 * @param data.status - Estado inicial del escritorio.
 * @param data.posX - Posición horizontal del escritorio.
 * @param data.posY - Posición vertical del escritorio.
 *
 * @returns Los datos del escritorio creado.
 */
export async function createDesk(data: {
  code: string
  zoneId: string
  status: 'AVAILABLE' | 'MAINTENANCE'
  posX: number
  posY: number
}) {
  const response = await api.post('/desks', data)
  return response.data
}

/**
 * Actualiza los datos de un escritorio existente.
 *
 * @param id - Identificador del escritorio que se desea actualizar.
 * @param data - Campos del escritorio que se desean modificar.
 * @param data.code - Nuevo código identificador del escritorio.
 * @param data.zoneId - Nuevo identificador de la zona.
 * @param data.status - Nuevo estado del escritorio.
 * @param data.posX - Nueva posición horizontal del escritorio.
 * @param data.posY - Nueva posición vertical del escritorio.
 *
 * @returns Los datos del escritorio actualizado.
 */
export async function updateDesk(
  id: string,
  data: Partial<{
    code: string
    zoneId: string
    status: 'AVAILABLE' | 'MAINTENANCE'
    posX: number
    posY: number
  }>,
) {
  const response = await api.patch(`/desks/${id}`, data)
  return response.data
}

/**
 * Elimina un escritorio existente del sistema.
 *
 * @param id - Identificador del escritorio que se desea eliminar.
 *
 * @returns La respuesta del servidor después de eliminar el escritorio.
 */
export async function deleteDesk(id: string) {
  const response = await api.delete(`/desks/${id}`)
  return response.data
}
