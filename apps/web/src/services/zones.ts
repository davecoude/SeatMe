import api from './api'

/**
 * Obtiene todas las zonas registradas en el sistema.
 *
 * @returns Lista de zonas.
 */
export async function fetchZones() {
  const response = await api.get('/zones')
  return response.data
}

/**
 * Crea una nueva zona en el sistema.
 *
 * @param data - Datos necesarios para crear la zona.
 * @param data.name - Nombre de la zona.
 * @param data.description - Descripción opcional de la zona.
 * @param data.floor - Número del piso donde se encuentra la zona.
 *
 * @returns Los datos de la zona creada.
 */
export async function createZone(data: { name: string; description?: string; floor: number }) {
  const response = await api.post('/zones', data)
  return response.data
}

/**
 * Actualiza los datos de una zona existente.
 *
 * @param id - Identificador de la zona que se desea actualizar.
 * @param data - Campos de la zona que se desean modificar.
 * @param data.name - Nuevo nombre de la zona.
 * @param data.description - Nueva descripción de la zona.
 * @param data.floor - Nuevo número de piso de la zona.
 *
 * @returns Los datos de la zona actualizada.
 */
export async function updateZone(
  id: string,
  data: Partial<{ name: string; description: string; floor: number }>,
) {
  const response = await api.patch(`/zones/${id}`, data)
  return response.data
}

/**
 * Elimina una zona existente del sistema.
 *
 * @param id - Identificador de la zona que se desea eliminar.
 *
 * @returns La respuesta del servidor después de eliminar la zona.
 */
export async function deleteZone(id: string) {
  const response = await api.delete(`/zones/${id}`)
  return response.data
}
