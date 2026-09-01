import { Router } from "express"
import { handleCreateZone, handleGetAllZones, handleGetZoneById, handleUpdateZone, handleDeleteZone } from "./zone.controller.js"

const router = Router()

router.post("/", handleCreateZone)
router.get("/", handleGetAllZones)
router.get("/:id", handleGetZoneById)
router.patch("/:id", handleUpdateZone)
router.delete("/:id", handleDeleteZone)

export default router