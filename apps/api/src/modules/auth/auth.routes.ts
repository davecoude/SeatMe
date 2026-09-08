import { Router } from "express"
import { handleRegister, handleLogin } from "./auth.controller.js"

const router = Router()

/** Router del módulo de autenticación */
router.post("/register", handleRegister)
router.post("/login", handleLogin)

export default router

