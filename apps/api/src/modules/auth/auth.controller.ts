import { Request, Response } from "express"
import { register, login } from "./auth.service.js"

/**
 * Maneja el registro de un nuevo usuario.
 * Crea el usuario con rol MEMBER y devuelve sus datos sin password.
 *
 * @route POST /auth/register
 * @param req - Body con email, password, firstName, lastName
 * @param res - 201 con el usuario creado, o 400/500 si falla
 */
export async function handleRegister(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body
    const user = await register(email, password, firstName, lastName)
    res.status(201).json(user)
    
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error en registro"
    res.status(400).json({ error: msg })
  }
}

/**
 * Maneja el inicio de sesión.
 * Verifica credenciales y devuelve un JWT.
 *
 * @route POST /auth/login
 * @param req - Body con email y password
 * @param res - 200 con el token, o 401/500 si falla
 */
export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const token = await login(email, password)
    res.status(200).json({ token })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error en login"
    res.status(401).json({ error: msg })
  }
}