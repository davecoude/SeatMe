import { Router } from "express"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"
import { handleCreateReservation,
  handleGetReservationByUser,
  handleGetReservationById,
  handleGetReservationByDesk,
  handleConfirmReservation,
  handleCheckInReservation,
  handleCompletedReservation,
  handleCancelReservation } from "./reservation.controller.js"

const router = Router()

router.post("/", authenticate, handleCreateReservation)
router.get("/my", authenticate, handleGetReservationByUser)
router.get("/desk/:deskId", authenticate, handleGetReservationByDesk)
router.get("/:id", authenticate, handleGetReservationById)
router.patch("/:id/confirm", authenticate, authorize(["ADMIN"]), handleConfirmReservation)
router.patch("/:id/check-in", authenticate, handleCheckInReservation)
router.patch("/:id/complete", authenticate, authorize(["ADMIN"]), handleCompletedReservation)
router.patch("/:id/cancel", authenticate, handleCancelReservation)

export default router