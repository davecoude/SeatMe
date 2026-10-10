import { z } from 'zod'

/**
 * Schema de validación para crear una zona.
 * Los campos desconocidos se descartan antes de llegar al service.
 */
export const CreateZoneSchema = z.object({
  /** Nombre identificador de la zona */
  name: z
    .string({ error: 'Nombre requerido' })
    .trim()
    .min(1, 'Nombre requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  /** Descripción opcional de la zona */
  description: z
    .string({ error: 'La descripcion debe ser texto' })
    .trim()
    .max(500, 'La descripcion no puede superar 500 caracteres')
    .nullish(),
  /** Número de piso donde se ubica la zona */
  floor: z.number({ error: 'El piso debe ser un numero' }).int('El piso debe ser un numero entero'),
})

/**
 * Schema de validación para actualizar una zona.
 * Todos los campos son opcionales, pero debe enviarse al menos uno.
 */
export const UpdateZoneSchema = CreateZoneSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Debe enviar al menos un campo para actualizar',
)

/** Tipo inferido del schema de creación de zona */
export type CreateZoneInput = z.infer<typeof CreateZoneSchema>
/** Tipo inferido del schema de actualización de zona */
export type UpdateZoneInput = z.infer<typeof UpdateZoneSchema>
