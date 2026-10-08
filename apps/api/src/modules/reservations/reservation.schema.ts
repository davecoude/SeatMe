import { z } from 'zod'

/**
 * Schema de validación para crear una reserva.
 * Valida formato y tipo de los datos antes de llegar al service.
 * El userId no se incluye porque viene del token JWT (req.user).
 * El status no se incluye porque siempre inicia como PENDING.
 */
export const CreateReservationSchema = z.object({
  /** ID del puesto a reservar — debe ser UUID válido */
  deskId: z.string().uuid(),
  /** Fecha de la reserva en formato ISO */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
  /** Hora de inicio en formato 24h con zero-padding */
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
  /** Hora de fin en formato 24h con zero-padding */
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
})

/** Tipo inferido del schema de creación de reserva */
export type CreateReservationInput = z.infer<typeof CreateReservationSchema>
