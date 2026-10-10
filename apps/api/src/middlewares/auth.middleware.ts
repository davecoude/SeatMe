import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        role: string
      }
    }
  }
}

/**
 * Middleware de autenticación.
 * Verifica que el request incluya un JWT válido en el header Authorization.
 * Si es válido, inyecta los datos del usuario en req.user y permite continuar.
 * Si no es válido o no existe, responde con 401.
 *
 * @param req - Request con header Authorization: Bearer <token>
 * @param res - Response para rechazar si no está autenticado
 * @param next - Función para continuar al siguiente middleware/controller
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET no configurado' })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as { userId: string; role: string }

    req.user = {
      userId: payload.userId,
      role: payload.role,
    }

    next()
  } catch {
    res.status(401).json({ error: 'Token invalido o expirado' })
  }
}

/**
 * Middleware de autorización por rol.
 * Verifica que el usuario autenticado tenga uno de los roles permitidos.
 * Debe usarse DESPUÉS del middleware authenticate.
 *
 * @param roles - Lista de roles permitidos (ej: ["ADMIN"])
 * @returns Middleware que verifica el rol del usuario
 *
 * @example
 * // Solo admins pueden crear zonas
 * router.post("/", authenticate, authorize(["ADMIN"]), handleCreateZone)
 */
export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tiene permiso para esta accion' })
      return
    }

    next()
  }
}
