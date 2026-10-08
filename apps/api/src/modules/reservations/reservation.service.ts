import { prisma } from '../../config/database.js'

/**
 * Crea una nueva reserva validando todas las reglas de negocio.
 * Ejecuta 5 validaciones en orden antes de crear:
 * 1. startTime debe ser anterior a endTime
 * 2. El desk debe existir
 * 3. El desk debe estar en estado AVAILABLE
 * 4. No debe haber otra reserva activa en ese desk que se solape
 * 5. El usuario no debe tener otra reserva activa que se solape
 *
 * @param userId - ID del usuario que hace la reserva (viene del JWT)
 * @param deskId - ID del puesto a reservar
 * @param date - Fecha de la reserva en formato "YYYY-MM-DD"
 * @param startTime - Hora de inicio en formato "HH:mm"
 * @param endTime - Hora de fin en formato "HH:mm"
 * @returns La reserva creada con status PENDING
 * @throws Error si alguna validación falla
 */
export async function createReservation(
  userId: string,
  deskId: string,
  date: string,
  startTime: string,
  endTime: string,
) {
  if (startTime >= endTime) throw new Error('Hora de inicio invalida')

  const desk = await prisma.desk.findUnique({ where: { id: deskId } })
  if (!desk) throw new Error('Problemas al obtener desk')

  if (desk.status !== 'AVAILABLE') throw new Error('Desk no disponible')

  const isReservationOverlapping = await prisma.reservation.findFirst({
    where: {
      deskId: deskId,
      date: new Date(date + 'T12:00:00Z'),
      status: { notIn: ['CANCELLED', 'COMPLETED'] },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  })

  if (isReservationOverlapping) throw new Error('Reserva activa para este desk')

  const hasUserReservation = await prisma.reservation.findFirst({
    where: {
      userId: userId,
      date: new Date(date + 'T12:00:00Z'),
      status: { notIn: ['CANCELLED', 'COMPLETED'] },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  })

  if (hasUserReservation) throw new Error('Usuario con reserva activa')

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      deskId,
      date: new Date(date + 'T12:00:00Z'),
      startTime,
      endTime,
      status: 'PENDING',
    },
  })

  return reservation
}

/**
 * Confirma una reserva pendiente.
 * Transición: PENDING → CONFIRMED
 *
 * @param reservationId - ID de la reserva a confirmar
 * @returns La reserva actualizada
 * @throws Error si la reserva no existe o no está en estado PENDING
 */
export async function confirmReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })

  if (!reservation) throw new Error('No se encontro la reservacion')
  if (reservation.status !== 'PENDING')
    throw new Error('Solo se pueden confirmar reservas pendientes')

  const updatedConfirm = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CONFIRMED' },
  })

  return updatedConfirm
}

/**
 * Registra el check-in de una reserva confirmada.
 * Transición: CONFIRMED → CHECKED_IN
 * Guarda la fecha y hora exacta del check-in.
 *
 * @param reservationId - ID de la reserva
 * @returns La reserva actualizada con checkInAt
 * @throws Error si la reserva no existe o no está en estado CONFIRMED
 */
export async function checkInReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })

  if (!reservation) throw new Error('No se encontro la reserva')
  if (reservation.status !== 'CONFIRMED')
    throw new Error('Check_in habilitado unicamente para reservas confirmadas')

  const updateCheckIn = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CHECKED_IN', checkInAt: new Date() },
  })

  return updateCheckIn
}

/**
 * Marca una reserva como completada después del check-in.
 * Transición: CHECKED_IN → COMPLETED
 *
 * @param reservationId - ID de la reserva a completar
 * @returns La reserva actualizada
 * @throws Error si la reserva no existe o no está en estado CHECKED_IN
 */
export async function completedReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })

  if (!reservation) throw new Error('No se encontro la reserva')
  if (reservation.status !== 'CHECKED_IN')
    throw new Error('Debe hacer check_in para poder completar la reserva')

  const updatedComplete = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'COMPLETED' },
  })

  return updatedComplete
}

/**
 * Cancela una reserva que esté pendiente o confirmada.
 * Transición: PENDING | CONFIRMED → CANCELLED
 * No elimina el registro — lo mantiene para historial y métricas.
 *
 * @param reservationId - ID de la reserva a cancelar
 * @returns La reserva actualizada con status CANCELLED
 * @throws Error si la reserva no existe o ya está en CHECKED_IN/COMPLETED/CANCELLED
 */
export async function cancelReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })

  if (!reservation) throw new Error('No se encontro la reserva')
  if (reservation.status !== 'PENDING' && reservation.status !== 'CONFIRMED')
    throw new Error('Cancelacion no valida para el estado actual de la reserva')

  const updatedDelete = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  })

  return updatedDelete
}

/**
 * Obtiene todas las reservas de un usuario específico.
 * Incluye los datos del desk y su zona para mostrar en el frontend.
 *
 * @param userId - ID del usuario
 * @returns Lista de reservas del usuario con desk y zona incluidos
 */
export async function getReservationByUser(userId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: { desk: { include: { zone: true } } },
  })

  return reservations
}

/**
 * Obtiene las reservas activas de un desk en una fecha específica.
 * Se usa para construir la vista de disponibilidad en el frontend.
 *
 * @param deskId - ID del puesto
 * @param date - Fecha a consultar en formato "YYYY-MM-DD"
 * @returns Lista de reservas activas del desk en esa fecha
 */
export async function getReservationByDesk(deskId: string, date: string) {
  const reservations = await prisma.reservation.findMany({
    where: {
      deskId,
      date: new Date(date + 'T12:00:00Z'),
      status: { notIn: ['CANCELLED'] },
    },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  })

  return reservations
}

/**
 * Busca una reserva por su ID único.
 * Incluye desk con zona y datos básicos del usuario.
 *
 * @param reservationId - ID de la reserva
 * @returns La reserva con relaciones incluidas, o null si no existe
 */
export async function getReservationById(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      desk: { include: { zone: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  })

  return reservation
}

/**
 * Obtiene todas las reservas del sistema (solo admin).
 * Incluye datos del usuario, desk y zona.
 *
 * @returns Lista completa de reservas con relaciones
 */
export async function getAllReservations() {
  const reservations = await prisma.reservation.findMany({
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      desk: { include: { zone: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return reservations
}
