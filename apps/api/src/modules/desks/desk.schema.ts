import { z } from 'zod'
import { DeskStatus } from '../../../prisma/generated/prisma/client.js'

/** Coordenada del puesto en el mapa visual (entero >= 0) */
const coordinate = (axis: string) =>
  z
    .number({ error: `${axis} debe ser un numero` })
    .int(`${axis} debe ser un numero entero`)
    .min(0, `${axis} no puede ser negativo`)

/**
 * Schema de validación para crear un puesto de trabajo.
 * Los campos desconocidos se descartan antes de llegar al service.
 */
export const CreateDeskSchema = z.object({
  /** Código identificador del puesto (ej: "A-01") */
  code: z
    .string({ error: 'Codigo requerido' })
    .trim()
    .min(1, 'Codigo requerido')
    .max(50, 'El codigo no puede superar 50 caracteres'),
  /** ID de la zona a la que pertenece el puesto */
  zoneId: z.uuid('zoneId debe ser un UUID valido'),
  /** Estado del puesto */
  status: z.enum(DeskStatus, { error: 'Estado invalido (AVAILABLE o MAINTENANCE)' }),
  /** Coordenadas para el renderizado en el mapa */
  posX: coordinate('posX'),
  posY: coordinate('posY'),
})

/**
 * Schema de validación para actualizar un puesto de trabajo.
 * Todos los campos son opcionales, pero debe enviarse al menos uno.
 */
export const UpdateDeskSchema = CreateDeskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Debe enviar al menos un campo para actualizar',
)

/** Tipo inferido del schema de creación de puesto */
export type CreateDeskInput = z.infer<typeof CreateDeskSchema>
/** Tipo inferido del schema de actualización de puesto */
export type UpdateDeskInput = z.infer<typeof UpdateDeskSchema>
