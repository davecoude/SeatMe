import { Router } from "express"
import { handleCreateAmenity, handleGetAllAmenities, handleGetAmenityById, handleUpdateAmenity, handleDeleteAmenity } from "./amenities.controller.js"

/** Router del módulo de amenities */
const router = Router()

router.post("/", handleCreateAmenity)
router.get("/", handleGetAllAmenities)
router.get("/:id", handleGetAmenityById)
router.patch("/:id", handleUpdateAmenity)
router.delete("/:id", handleDeleteAmenity)

export default router