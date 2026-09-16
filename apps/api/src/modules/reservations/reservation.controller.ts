import { Request, Response } from "express"
import { ZodError } from "zod"
import { CreateReservationSchema } from "./reservation.schema.js"
import { createReservation,
  getReservationByUser,
  getReservationById,
  getReservationByDesk,
  confirmReservation,
  checkInReservation,
  completedReservation,
  cancelReservation } from "./reservation.service.js"

/**
 * Crea una nueva reservación para el usuario autenticado.
 *
 * Valida los datos recibidos en el body mediante CreateReservationSchema
 * y delega la creación de la reservación al servicio correspondiente.
 *
 * @param req - Petición HTTP que contiene los datos de la reservación en el body
 *              y el usuario autenticado en req.user.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Error de validación de los datos o error proveniente del servicio.
 * @throws 401 - Si no existe un usuario autenticado.
 * @returns 201 - La reservación creada.
 */
export async function handleCreateReservation(req: Request, res: Response) {
  try {

    const userId = req.user?.userId

    if(!userId) {
      res.status(401).json({ error: "No autenticado"})
      return
    }

    const data = CreateReservationSchema.parse(req.body)
    const reservation = await createReservation(userId, data.deskId, data.date, data.startTime, data.endTime)

    res.status(201).json(reservation)

  } catch (error) {
    if(error instanceof ZodError) {
      res.status(400).json({ error: error.issues })
      return
    }

    const msg = error instanceof Error ? error.message : "Error al crear la reserva"
    res.status(400).json({ error: msg })
  }
}

/**
 * Obtiene todas las reservaciones asociadas al usuario autenticado.
 *
 * Obtiene el identificador del usuario desde req.user y delega
 * la consulta al servicio de reservaciones.
 *
 * @param req - Petición HTTP que contiene la información del usuario autenticado.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Error al obtener las reservaciones.
 * @throws 401 - Si no existe un usuario autenticado.
 * @returns 200 - Lista de reservaciones pertenecientes al usuario.
 */
export async function handleGetReservationByUser(req: Request, res: Response) {
  try {

    const userId = req.user?.userId

    if(!userId) {
      res.status(400).json({ error: "ID invalido" })
      return
    }

    const reservation = await getReservationByUser(userId)
    res.status(200).json(reservation)

    
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al obtener reservacion del usuario"
    res.status(400).json({ error: msg})
  }
}

/**
 * Obtiene una reservación mediante su identificador.
 *
 * El identificador de la reservación se obtiene desde los parámetros
 * de la URL.
 *
 * @param req - Petición HTTP que contiene el ID de la reservación en req.params.id.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID es inválido o ocurre un error durante la consulta.
 * @returns 200 - La reservación encontrada.
 */
export async function handleGetReservationById(req: Request, res: Response) {
  try {

    const { id } = req.params

    if(!id || typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const reservation = await getReservationById(id)
    res.status(200).json(reservation)
    
  } catch (error) {
    res.status(400).json({ error: "Error al obtener reservacion"})
  }
}

/**
 * Obtiene las reservaciones de un escritorio para una fecha determinada.
 *
 * El ID del escritorio se obtiene desde los parámetros de la URL y la
 * fecha se recibe como query parameter en formato YYYY-MM-DD.
 *
 * @param req - Petición HTTP que contiene deskId en los parámetros de la URL
 *              y date como query parameter.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID del escritorio o la fecha son inválidos,
 * @returns 200 - Lista de reservaciones del escritorio para la fecha indicada.
 *                o si ocurre un error durante la consulta.
 */
export async function handleGetReservationByDesk(req: Request, res: Response) {
  try {

    const { deskId } = req.params
    const { date } = req.query

    if(!deskId || typeof deskId !== "string") {
      res.status(400).json({ error: "ID invalido para desk"})
      return
    }
    
    if(!date || typeof date !== "string"){
      res.status(400).json({ error: "Fecha requerida (query param: ?date=YYYY-MM-DD)"})
      return
    }

    const reservation = await getReservationByDesk(deskId, date)
    res.status(200).json(reservation)
    
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al obtener reservas de desk"
    res.status(400).json({ error: msg })
  }
}

/**
 * Confirma una reservación existente.
 *
 * Obtiene el ID de la reservación desde los parámetros de la URL
 * y delega la operación al servicio correspondiente.
 *
 * @param req - Petición HTTP que contiene el ID de la reservación en req.params.id.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID es inválido o no es posible confirmar la reservación.
 * @returns 200 - La reservación confirmada.
 */
export async function handleConfirmReservation(req: Request, res: Response) {
  try {
    
    const { id } = req.params

    if(!id || typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const reservation = await confirmReservation(id)
    res.status(200).json(reservation)

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al confirmar la reserva"
    res.status(400).json({ error: msg })
  }
}

/**
 * Realiza el check-in de una reservación.
 *
 * Obtiene el ID de la reservación desde los parámetros de la URL
 * y delega la operación al servicio correspondiente.
 *
 * @param req - Petición HTTP que contiene el ID de la reservación en req.params.id.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID es inválido o no es posible realizar el check-in.
 * @returns 200 - La reservación después de realizar el check-in.
 */
export async function handleCheckInReservation(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(!id || typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const reservation = await checkInReservation(id)
    res.status(200).json(reservation)

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error para realizar el check_in"
    res.status(400).json({ error: msg })
  }
}

/**
 * Marca una reservación como completada.
 *
 * Obtiene el ID de la reservación desde los parámetros de la URL
 * y delega la actualización al servicio correspondiente.
 *
 * @param req - Petición HTTP que contiene el ID de la reservación en req.params.id.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID es inválido o no es posible completar la reservación.
 * @returns 200 - La reservación marcada como completada.
 */
export async function handleCompletedReservation(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(!id || typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const reservation = await completedReservation(id)
    res.status(200).json(reservation)

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error para completar reserva"
    res.status(400).json({ error: msg })
  }
}

/**
 * Cancela una reservación existente.
 *
 * Obtiene el ID de la reservación desde los parámetros de la URL
 * y delega la cancelación al servicio correspondiente.
 *
 * @param req - Petición HTTP que contiene el ID de la reservación en req.params.id.
 * @param res - Respuesta HTTP de Express.
 *
 * @throws 400 - Si el ID es inválido o no es posible cancelar la reservación.
 * @returns 200 - La reservación cancelada.
 */
export async function handleCancelReservation(req: Request, res: Response) {
  try {
    const { id } = req.params

    if(!id || typeof id !== "string") {
      res.status(400).json({ error: "ID invalido"})
      return
    }

    const reservation = await cancelReservation(id)
    res.status(200).json(reservation)

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error para cancelar reserva"
    res.status(400).json({ error: msg })
  }
}