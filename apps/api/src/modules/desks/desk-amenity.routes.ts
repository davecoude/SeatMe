import { Router } from "express"
import { handleCreateDeskAmenity, handleGetDeskAmenity, handleDeleteDeskAmenity } from "./desk-amenity.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

/** Router del módulo de relación desk-amenity (rutas anidadas bajo /desks) */
const router = Router()

router.post("/:deskId/amenities/:amenityId", authenticate, authorize(["ADMIN"]), handleCreateDeskAmenity)
router.get("/:deskId/amenities", authenticate, handleGetDeskAmenity)
router.delete("/:deskId/amenities/:amenityId", authenticate, authorize(["ADMIN"]), handleDeleteDeskAmenity)

export default router