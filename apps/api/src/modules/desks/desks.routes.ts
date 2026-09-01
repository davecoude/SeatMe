import { Router } from "express"
import { handleCreateDesk, handleGetAllDesks, handleGetDeskById, handleUpdateDesk, handleDeleteDesk } from "./desks.controller.js"

const router = Router()

router.post("/", handleCreateDesk)
router.get("/", handleGetAllDesks)
router.get("/:id", handleGetDeskById)
router.patch("/:id", handleUpdateDesk)
router.delete("/:id", handleDeleteDesk)

export default router