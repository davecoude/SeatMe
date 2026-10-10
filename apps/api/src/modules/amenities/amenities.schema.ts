import { z } from 'zod'

/**
 * Schema de validación para crear un amenity.
 * Los campos desconocidos se descartan antes de llegar al service.
 */
export const CreateAmenitySchema = z.object({
  /** Nombre descriptivo del amenity (ej: "Monitor 4K") */
  name: z
    .string({ error: 'Nombre requerido' })
    .trim()
    .min(1, 'Nombre requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  /** Identificador del ícono para el frontend (ej: "monitor") */
  icon: z
    .string({ error: 'Icono requerido' })
    .trim()
    .min(1, 'Icono requerido')
    .max(50, 'El icono no puede superar 50 caracteres'),
})

/**
 * Schema de validación para actualizar un amenity.
 * Todos los campos son opcionales, pero debe enviarse al menos uno.
 */
export const UpdateAmenitySchema = CreateAmenitySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Debe enviar al menos un campo para actualizar',
)

/** Tipo inferido del schema de creación de amenity */
export type CreateAmenityInput = z.infer<typeof CreateAmenitySchema>
/** Tipo inferido del schema de actualización de amenity */
export type UpdateAmenityInput = z.infer<typeof UpdateAmenitySchema>
