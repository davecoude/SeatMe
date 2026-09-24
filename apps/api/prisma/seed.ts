import { PrismaClient } from '../prisma/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Limpiar datos existentes
  await prisma.deskAmenity.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.desk.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.zone.deleteMany()

  // Crear zonas
  const zoneNorth = await prisma.zone.create({
    data: { name: 'Zona Norte', description: 'Área tranquila junto a la ventana', floor: 1 }
  })
  const zoneSouth = await prisma.zone.create({
    data: { name: 'Zona Sur', description: 'Área colaborativa abierta', floor: 1 }
  })
  const zoneUpper = await prisma.zone.create({
    data: { name: 'Zona Superior', description: 'Segundo piso, vista panorámica', floor: 2 }
  })

  // Crear amenities
  const monitor = await prisma.amenity.create({
    data: { name: 'Monitor 4K', icon: 'monitor' }
  })
  const standing = await prisma.amenity.create({
    data: { name: 'Standing Desk', icon: 'arrow-up' }
  })
  const headset = await prisma.amenity.create({
    data: { name: 'Headset', icon: 'headphones' }
  })

  // Crear desks en Zona Norte (posiciones para el mapa visual)
  const desksNorth = await Promise.all([
    prisma.desk.create({ data: { code: 'N-01', zoneId: zoneNorth.id, status: 'AVAILABLE', posX: 50, posY: 50 } }),
    prisma.desk.create({ data: { code: 'N-02', zoneId: zoneNorth.id, status: 'AVAILABLE', posX: 150, posY: 50 } }),
    prisma.desk.create({ data: { code: 'N-03', zoneId: zoneNorth.id, status: 'MAINTENANCE', posX: 250, posY: 50 } }),
    prisma.desk.create({ data: { code: 'N-04', zoneId: zoneNorth.id, status: 'AVAILABLE', posX: 50, posY: 150 } }),
  ])

  // Crear desks en Zona Sur
  await Promise.all([
    prisma.desk.create({ data: { code: 'S-01', zoneId: zoneSouth.id, status: 'AVAILABLE', posX: 50, posY: 50 } }),
    prisma.desk.create({ data: { code: 'S-02', zoneId: zoneSouth.id, status: 'AVAILABLE', posX: 150, posY: 50 } }),
    prisma.desk.create({ data: { code: 'S-03', zoneId: zoneSouth.id, status: 'AVAILABLE', posX: 250, posY: 50 } }),
  ])

  // Crear desks en Zona Superior
  await Promise.all([
    prisma.desk.create({ data: { code: 'U-01', zoneId: zoneUpper.id, status: 'AVAILABLE', posX: 50, posY: 50 } }),
    prisma.desk.create({ data: { code: 'U-02', zoneId: zoneUpper.id, status: 'AVAILABLE', posX: 150, posY: 50 } }),
  ])

  // Asignar amenities a algunos desks
  await Promise.all([
    prisma.deskAmenity.create({ data: { deskId: desksNorth[0].id, amenityId: monitor.id } }),
    prisma.deskAmenity.create({ data: { deskId: desksNorth[0].id, amenityId: headset.id } }),
    prisma.deskAmenity.create({ data: { deskId: desksNorth[1].id, amenityId: standing.id } }),
    prisma.deskAmenity.create({ data: { deskId: desksNorth[3].id, amenityId: monitor.id } }),
    prisma.deskAmenity.create({ data: { deskId: desksNorth[3].id, amenityId: standing.id } }),
  ])

  console.log('Seed completado')
}

main()
  .catch(console.error)
  .finally(() => pool.end())