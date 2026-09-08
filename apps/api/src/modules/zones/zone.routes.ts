import { Router } from "express"
import { handleCreateZone, handleGetAllZones, handleGetZoneById, handleUpdateZone, handleDeleteZone } from "./zone.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authenticate, authorize(["ADMIN"]), handleCreateZone)
router.get("/", authenticate, handleGetAllZones)
router.get("/:id",authenticate, handleGetZoneById)
router.patch("/:id", authenticate, authorize(["ADMIN"]), handleUpdateZone)
router.delete("/:id", authenticate, authorize(["ADMIN"]), handleDeleteZone)

export default router