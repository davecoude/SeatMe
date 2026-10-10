/**
 * Error de negocio con código de estado HTTP asociado.
 * Permite que los services indiquen al controller qué status responder
 * (ej: 403, 404) en lugar del 400 genérico.
 *
 * @example
 * throw new HttpError(404, 'No se encontro la reserva')
 */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
