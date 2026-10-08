import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/database.js'

/**
 * Registra un nuevo usuario en el sistema.
 *
 * La contraseña recibida es cifrada antes de almacenarse en la base de datos.
 * El usuario se registra con el rol `MEMBER` y la respuesta excluye la contraseña.
 *
 * @param email - Correo electrónico del usuario.
 * @param password - Contraseña del usuario.
 * @param firstName - Nombre del usuario.
 * @param lastName - Apellido del usuario.
 *
 * @returns El usuario creado sin incluir su contraseña.
 *
 * @throws Error Si ocurre un error durante la creación del usuario.
 */
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: 'MEMBER',
    },
  })

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Autentica un usuario mediante sus credenciales y genera un token JWT.
 *
 * Verifica que el usuario exista y que la contraseña proporcionada
 * coincida con la contraseña almacenada. El token generado contiene
 * el identificador y el rol del usuario.
 *
 * @param email - Correo electrónico utilizado para iniciar sesión.
 * @param password - Contraseña del usuario.
 *
 * @returns Token JWT generado para el usuario autenticado.
 *
 * @throws Error Si el usuario no existe.
 * @throws Error Si la contraseña proporcionada no coincide.
 * @throws Error Si la variable de entorno `JWT_SECRET` no está configurada.
 * @throws Error Si la variable de entorno `JWT_EXPIRES_IN` no está configurada.
 */
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Usuario no encontrado')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Password no coincide')

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no configurado')

  const expiresIn = process.env.JWT_EXPIRES_IN
  if (!expiresIn) throw new Error('JWT_EXPIRES_IN no configurado')

  const token = jwt.sign({ userId: user.id, role: user.role, firstName: user.firstName }, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  })

  return token
}
