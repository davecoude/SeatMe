import { z } from 'zod'

/** Schema de validación para rutas con solo el ID del puesto */
export const DeskParamsSchema = z.object({
  deskId: z.uuid('deskId debe ser un UUID valido'),
})

/** Schema de validación para rutas con el ID del puesto y del amenity */
export const DeskAmenityParamsSchema = DeskParamsSchema.extend({
  amenityId: z.uuid('amenityId debe ser un UUID valido'),
})
