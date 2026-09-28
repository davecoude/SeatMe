import api from "./api"

/**
 * Crea una nueva reserva de escritorio.
 *
 * @param data - Datos necesarios para crear la reserva.
 * @param data.deskId - Identificador del escritorio que se desea reservar.
 * @param data.date - Fecha de la reserva.
 * @param data.startTime - Hora de inicio de la reserva.
 * @param data.endTime - Hora de finalización de la reserva.
 *
 * @returns Los datos de la reserva creada.
 */
export async function createReservation(data: { deskId: string, date: string, startTime: string, endTime: string }) {
  const response = await api.post("/reservations", data)
  return response.data
}

/**
 * Obtiene las reservas del usuario autenticado.
 *
 * @returns Lista de reservas pertenecientes al usuario autenticado.
 */
export async function fetchMyReservations() {
  const response =  await api.get("/reservations/my")
  return response.data
}

/**
 * Obtiene las reservas de un escritorio para una fecha específica.
 *
 * @param deskId - Identificador del escritorio.
 * @param date - Fecha para consultar las reservas.
 *
 * @returns Lista de reservas asociadas al escritorio en la fecha indicada.
 */
export async function fetchDeskReservations(deskId: string, date: string) {
  const response = await api.get(`/reservations/desk/${deskId}?date=${date}`)
  return response.data
}

/**
 * Registra el check-in de una reserva.
 *
 * @param id - Identificador de la reserva.
 *
 * @returns Los datos de la reserva después de registrar el check-in.
 */
export async function checkInReservation(id: string) {
  const response = await api.patch(`/reservations/${id}/check-in`)
  return response.data
}

/**
 * Cancela una reserva existente.
 *
 * @param id - Identificador de la reserva que se desea cancelar.
 *
 * @returns Los datos de la reserva después de su cancelación.
 */
export async function cancelReservation(id: string) {
  const response = await api.patch(`/reservations/${id}/cancel`)
  return response.data
}

/**
 * Obtiene todas las reservas registradas en el sistema.
 *
 * @returns Lista completa de reservas.
 */
export async function fetchAllReservations() {
  const response = await api.get('/reservations/all')
  return response.data
}

/**
 * Confirma una reserva existente.
 *
 * @param id - Identificador de la reserva que se desea confirmar.
 *
 * @returns Los datos de la reserva después de su confirmación.
 */
export async function confirmReservation(id: string) {
  const response = await api.patch(`/reservations/${id}/confirm`)
  return response.data
}

/**
 * Marca una reserva como completada.
 *
 * @param id - Identificador de la reserva que se desea completar.
 *
 * @returns Los datos de la reserva después de marcarla como completada.
 */
export async function completeReservation(id: string) {
  const response =  await api.patch(`/reservations/${id}/complete`)
  return response.data
}