import { Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '../../prisma/generated/prisma/client.js'
import { HttpError } from './http-error.js'

/**
 * Mapa de códigos de error de Prisma a la respuesta que se quiere devolver.
 * - P2025: el registro a actualizar/eliminar no existe
 * - P2003: violación de llave foránea (referencia inexistente o registros dependientes)
 * - P2002: violación de restricción única (el registro ya existe)
 */
export type PrismaErrorMap = Partial<
  Record<'P2002' | 'P2003' | 'P2025', { status: number; message: string }>
>

/**
 * Envía una respuesta de error según el tipo de error capturado.
 *
 * - ZodError → 400 con el primer mensaje de validación
 * - HttpError → su status y mensaje
 * - Error conocido de Prisma presente en `prismaErrors` → el status y mensaje indicados
 * - Cualquier otro → 500 con el mensaje genérico `fallback`
 *
 * @param res - Response de Express
 * @param error - Error capturado en el catch
 * @param fallback - Mensaje para errores no esperados
 * @param prismaErrors - Traducción de códigos de Prisma para este endpoint
 *
 * @example
 * sendError(res, error, 'Error al eliminar la zona', {
 *   P2025: { status: 404, message: 'Zona no encontrada' },
 * })
 */
export function sendError(
  res: Response,
  error: unknown,
  fallback: string,
  prismaErrors: PrismaErrorMap = {},
) {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues[0]?.message ?? 'Datos invalidos' })
    return
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = prismaErrors[error.code as keyof PrismaErrorMap]
    if (mapped) {
      res.status(mapped.status).json({ error: mapped.message })
      return
    }
  }

  res.status(500).json({ error: fallback })
}
