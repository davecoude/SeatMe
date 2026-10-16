import { createDesk, getAllDesks, getDeskById, updateDesk, deleteDesk } from './desks.service.js'

// mock de zones y desk
vi.mock('../../config/database.js', () => ({
  prisma: {
    desk: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../../config/database.js'
import { DeskStatus } from '../../../prisma/generated/prisma/index.js'

describe('DeskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // getAllDesks service test
  it('Obtener desks con sus zonas', async () => {
    // const deskId = 'acb3771a-1901-4174-be1e-07f089b840ea'
    const desks = [
      {
        id: 'desk-123',
        code: 'A-01',
        zoneId: 'zone-123',
        status: DeskStatus.AVAILABLE,
        posX: 10,
        posY: 20,
        createdAt: new Date('2026-09-22T19:05:10.367Z'),
        zone: { id: 'zone-123', name: 'Zona Oeste', description: 'Lorem ipsum', floor: 1 },
      },
      {
        id: 'desk-123',
        code: 'A-01',
        zoneId: 'zone-123',
        status: DeskStatus.AVAILABLE,
        posX: 10,
        posY: 20,
        createdAt: new Date('2026-09-22T19:05:10.367Z'),
        zone: { id: 'zone-123', name: 'Zona Oeste', description: 'Lorem ipsum', floor: 1 },
      },
      {
        id: 'desk-123',
        code: 'A-01',
        zoneId: 'zone-123',
        status: DeskStatus.AVAILABLE,
        posX: 10,
        posY: 20,
        createdAt: new Date('2026-09-22T19:05:10.367Z'),
        zone: { id: 'zone-123', name: 'Zona Oeste', description: 'Lorem ipsum', floor: 1 },
      },
    ]

    vi.mocked(prisma.desk.findMany).mockResolvedValue(desks)

    const result = await getAllDesks()

    expect(result).toEqual(desks)
    expect(prisma.desk.findMany).toHaveBeenCalled()
  })

  // getDeskById service test
  it('Obtener desk por ID', async () => {
    const deskId = 'desk-123'
    const zone = { id: 'desk-123', name: 'A-01', description: 'Lorem ipsum', floor: 1 }
    const desk = {
      id: deskId,
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
      zone: { ...zone },
    }

    vi.mocked(prisma.desk.findUnique).mockResolvedValue(desk)

    const result = await getDeskById(deskId)

    expect(result).toEqual(desk)
    expect(prisma.desk.findUnique).toHaveBeenCalledWith({
      where: { id: deskId },
      include: { zone: true },
    })
  })

  // createDesk service test
  it('Creacion de un desk', async () => {
    const deskId = 'desk-123'
    const createdAt = new Date('2026-09-22T19:05:10.367Z')
    const desk = {
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
    }

    vi.mocked(prisma.desk.create).mockResolvedValue({ id: deskId, ...desk, createdAt })

    const result = await createDesk(desk)

    expect(result).toEqual({ id: deskId, ...desk, createdAt })
    expect(prisma.desk.create).toHaveBeenCalledWith({ data: { ...desk } })
  })

  // updateDesk service test
  it('Actualizar datos de un desk', async () => {
    const deskId = 'desk-123'
    const createdAt = new Date('2026-09-22T19:05:10.367Z')
    const desk = {
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
    }

    vi.mocked(prisma.desk.update).mockResolvedValue({ id: deskId, ...desk, createdAt })

    const result = await updateDesk(deskId, desk)

    expect(result).toEqual({ id: deskId, ...desk, createdAt })
    expect(prisma.desk.update).toHaveBeenCalledWith({ where: { id: deskId }, data: { ...desk } })
  })

  // deleteDesk service test
  it('Eliminar un registro desk', async () => {
    const deskId = 'desk-123'
    const desk = {
      id: deskId,
      code: 'A-01',
      zoneId: 'zone-123',
      status: DeskStatus.AVAILABLE,
      posX: 10,
      posY: 20,
      createdAt: new Date('2026-09-22T19:05:10.367Z'),
    }

    vi.mocked(prisma.desk.delete).mockResolvedValue(desk)

    const result = await deleteDesk(deskId)

    expect(result).toEqual(desk)
    expect(prisma.desk.delete).toHaveBeenCalledWith({ where: { id: deskId } })
  })
})
