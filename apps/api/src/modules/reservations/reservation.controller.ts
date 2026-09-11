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

export async function handleGetReservationByUser(req: Request, res: Response) {
  try {

    const userId = req.user?.userId

    if(!userId) {
      res.status(401).json({ error: "ID invalido" })
      return
    }

    const reservation = await getReservationByUser(userId)
    res.status(200).json(reservation)

    
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al obtener reservacion del usuario"
    res.status(400).json({ error: msg})
  }
}

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
    const msg = error instanceof Error ? error.message : "Error para completar reserva"
    res.status(400).json({ error: msg })
  }
}