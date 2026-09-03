import { Router } from "express"
import { handleCreateDeskAmenity, handleGetDeskAmenity, handleDeleteDeskAmenity } from "./desk-amenity.controller.js"

/** Router del módulo de relación desk-amenity (rutas anidadas bajo /desks) */
const router = Router()

router.post("/:deskId/amenities/:amenityId", handleCreateDeskAmenity)
router.get("/:deskId/amenities", handleGetDeskAmenity)
router.delete("/:deskId/amenities/:amenityId", handleDeleteDeskAmenity)

export default router