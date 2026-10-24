import { createReservation, confirmReservation, checkInReservation } from './reservation.service.js'

vi.mock('../../config/database.js', () => ({
  prisma: {
    reservation: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    desk: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from '../../config/database.js'
import { ReservationStatus } from '../../../prisma/generated/prisma/index.js'
import { DeskStatus } from '../../../prisma/generated/prisma/index.js'

describe('ReservationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // createReservation test
  it('Crear una reserva', async () => {
    const reservationId = 'f32c4c92-b1db-45f5-91b9-72530527fc31'
    const userId = '6d79643d-ac0f-4d40-88ee-830d1ea957d3'
    const deskId = 'c2cdc264-d47e-48eb-bcef-2744ddfc7878'

    const reservation = {
      id: reservationId,
      userId: userId,
      deskId: deskId,
      date: new Date('2026-10-23T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.PENDING,
      checkInAt: null,
      createdAt: new Date('2026-10-24T02:40:09.158Z'),
      updatedAt: new Date('2026-10-24T02:40:09.158Z'),
    }

    const desk = {
      id: deskId,
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
    }

    vi.mocked(prisma.desk.findUnique).mockResolvedValue(desk)
    vi.mocked(prisma.reservation.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.reservation.create).mockResolvedValue(reservation)

    const result = await createReservation(userId, deskId, '2026-10-23', '15:00', '16:00')

    expect(result).toEqual(reservation)
  })

  // sad paths
  it('Solapamiento si startTime >= endTime', async () => {
    await expect(
      createReservation('user-123', 'desk-123', '2026-10-23', '16:00', '15:00'),
    ).rejects.toThrow('Hora de inicio invalida')
  })

  it('Lanza error cuando el desk no existe', async () => {
    vi.mocked(prisma.desk.findUnique).mockResolvedValue(null)
    await expect(
      createReservation('user-123', 'desk-123', '2026-10-23', '15:00', '16:00'),
    ).rejects.toThrow('Problemas al obtener desk')
  })

  it('Lanza error cuando el desk no esta disponible', async () => {
    const desk = {
      id: 'desk-123',
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.MAINTENANCE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
    }

    vi.mocked(prisma.desk.findUnique).mockResolvedValue(desk)

    await expect(
      createReservation('user-123', 'desk-123', '2026-10-23', '15:00', '16:00'),
    ).rejects.toThrow('Desk no disponible')
  })

  it('Lanza error cuando hay una reserva activa en ese desk(overlap desk)', async () => {
    const desk = {
      id: 'desk-123',
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
    }

    vi.mocked(prisma.desk.findUnique).mockResolvedValue(desk)
    vi.mocked(prisma.reservation.findFirst).mockResolvedValue({
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T02:40:09.158Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.COMPLETED,
      createdAt: new Date('2026-10-24T02:40:09.158Z'),
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-25T02:40:09.158Z'),
    })

    await expect(
      createReservation('user-123', 'desk-123', '2026-10-23', '15:00', '16:00'),
    ).rejects.toThrow('Reserva activa para este desk')
  })

  it('Lanza error cuando el usuario ya tiene una reserva activa(user overlap)', async () => {
    const desk = {
      id: 'desk-123',
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
    }

    vi.mocked(prisma.desk.findUnique).mockResolvedValue(desk)
    vi.mocked(prisma.reservation.findFirst)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: '123',
        userId: 'user-123',
        deskId: 'desk-123',
        date: new Date('2026-10-24T02:40:09.158Z'),
        startTime: '15:00',
        endTime: '16:00',
        status: ReservationStatus.CONFIRMED,
        createdAt: new Date('2026-10-24T02:40:09.158Z'),
        checkInAt: new Date('2026-10-25T02:40:09.158Z'),
        updatedAt: new Date('2026-10-25T02:40:09.158Z'),
      })

    await expect(
      createReservation('user-123', 'desk-123', '2026-10-23', '15:00', '16:00'),
    ).rejects.toThrow('Usuario con reserva activa')
  })

  // confirmReservation test
  it('Confirmar una reserva', async () => {
    const reservation = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.PENDING,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-25T02:40:09.158Z'),
    }

    const isConfirmReservation = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.CONFIRMED,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-26T02:40:09.158Z'),
    }

    vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservation)
    vi.mocked(prisma.reservation.update).mockResolvedValue(isConfirmReservation)

    const result = await confirmReservation('reservation-123')

    expect(result).toEqual(isConfirmReservation)
  })

  it('Reserva no existe', async () => {
    vi.mocked(prisma.reservation.findUnique).mockResolvedValue(null)
    await expect(confirmReservation('reservation-123')).rejects.toThrow(
      'No se encontro la reservacion',
    )
  })

  it('Confirmar solo reservas pendientes', async () => {
    const reservationPending = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.CHECKED_IN,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-26T02:40:09.158Z'),
    }

    vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservationPending)

    await expect(confirmReservation('reservation-123')).rejects.toThrow(
      'Solo se pueden confirmar reservas pendientes',
    )
  })

  // checkInReservation test
  it('Reserva existe', async () => {
    const requester = { userId: 'user-123', role: 'ADMIN' }

    const reservation = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.CONFIRMED,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-25T02:40:09.158Z'),
    }

    const isCheckReservation = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.CHECKED_IN,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-25T02:40:09.158Z'),
    }

    vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservation)
    vi.mocked(prisma.reservation.update).mockResolvedValue(isCheckReservation)

    const result = await checkInReservation('reservation-123', requester)

    expect(result).toEqual(isCheckReservation)
  })

  it('Permisos para modificar una reserva', async () => {
    const isNotRequester = { userId: 'user-456', role: 'MEMBER' }

    const reservation = {
      id: 'reservation-123',
      userId: 'user-123',
      deskId: 'desk-123',
      date: new Date('2026-10-24T12:00:00.000Z'),
      startTime: '15:00',
      endTime: '16:00',
      status: ReservationStatus.CONFIRMED,
      checkInAt: new Date('2026-10-25T02:40:09.158Z'),
      createdAt: new Date('2026-10-25T02:40:09.158Z'),
      updatedAt: new Date('2026-10-25T02:40:09.158Z'),
    }

    vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservation)

    await expect(checkInReservation('reservation-123', isNotRequester)).rejects.toThrow(
      'No tiene permiso sobre esta reserva',
    )
  })
})
