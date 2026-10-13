import { createZone, getAllZones, getZoneById, updateZone, deleteZone } from './zone.service.js'

// Mockear el modulo que exporta prisma
vi.mock('../../config/database.ts', () => ({
  prisma: {
    zone: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../../config/database.js'

describe('ZonaService', () => {
  // getAllZones service test
  it('Obtener todas las zonas', async () => {
    const zones = [
      {
        id: 'ae26fad4-66f3-41b1-812a-e01c981112fa',
        name: 'Zona superior',
        description: 'Piso con silencio total',
        floor: 1,
      },
      {
        id: 'be26fad4-66f3-41b1-812a-e01c981112fb',
        name: 'Zona inferior',
        description: 'Piso con aire natural',
        floor: 2,
      },
      {
        id: 'fe26fad4-66f3-41b1-812a-e01c981112ff',
        name: 'Zona infantil',
        description: 'Piso con dinamicas',
        floor: 3,
      },
    ]

    vi.mocked(prisma.zone.findMany).mockResolvedValue(zones)

    const result = await getAllZones()

    expect(result).toEqual(zones)
    expect(prisma.zone.findMany).toHaveBeenCalled()
  })

  // getZoneById service test
  it('Obtener zona por id', async () => {
    const zoneId = 'te26fad4-66f3-41b1-812a-e01c981112ft'
    const zone = {
      id: zoneId,
      name: 'Zona superior',
      description: 'Con vista panoramica',
      floor: 1,
    }

    vi.mocked(prisma.zone.findUnique).mockResolvedValue(zone)

    const result = await getZoneById(zoneId)

    expect(result).toEqual(zone)
    expect(prisma.zone.findUnique).toHaveBeenCalledWith({ where: { id: zoneId } })
  })

  // createZone service test
  it('Verificar si una zona fue creada', async () => {
    const zoneId = 'te26fad4-66f3-41b1-812a-e01c981112ft'
    const zone = {
      name: 'Zona Oeste',
      description: 'Espacio exclusivo empresarial',
      floor: 2,
    }

    vi.mocked(prisma.zone.create).mockResolvedValue({ id: zoneId, ...zone })

    const result = await createZone(zone)

    expect(result).toEqual({ id: zoneId, ...zone })
    expect(prisma.zone.create).toHaveBeenCalledWith({ data: { ...zone } })
  })

  // updateZone service test
  it('Actualizar datos de una zona', async () => {
    const zoneId = 'te26fad4-66f3-41b1-812a-e01c981112ft'
    const zone = {
      name: 'Zona Oeste',
      description: 'Espacio exclusivo empresarial',
      floor: 3,
    }

    vi.mocked(prisma.zone.update).mockResolvedValue({ id: zoneId, ...zone })

    const result = await updateZone(zoneId, zone)

    expect(result).toEqual({ id: zoneId, ...zone })
    expect(prisma.zone.update).toHaveBeenCalledWith({
      where: { id: zoneId },
      data: { ...zone },
    })
  })

  // deleteZone service test
  it('Verifica la eliminacion de una zona', async () => {
    const zoneId = 'te26fad4-66f3-41b1-812a-e01c981112ft'
    const zone = {
      name: 'Zona Oeste',
      description: 'Espacio exclusivo empresarial',
      floor: 3,
    }

    vi.mocked(prisma.zone.delete).mockResolvedValue({ id: zoneId, ...zone })

    const result = await deleteZone(zoneId)

    expect(result).toEqual({ id: zoneId,...zone })
    expect(prisma.zone.delete).toHaveBeenCalledWith({ where: { id: zoneId }})
  })
})

beforeEach(() => {
  vi.clearAllMocks()
})
