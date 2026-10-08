import { z } from 'zod'

/**
 * Esquema de validación para el registro de un nuevo usuario.
 *
 * Valida que los datos proporcionados cumplan con los requisitos mínimos
 * necesarios antes de crear la cuenta.
 *
 * Campos:
 * - email: Debe ser una dirección de correo electrónico válida.
 * - password: Debe tener al menos 8 caracteres, una letra mayúscula
 *   y al menos un número.
 * - firstName: Nombre obligatorio. Debe contener al menos un carácter.
 * - lastName: Apellido obligatorio. Debe contener al menos un carácter.
 *
 * Si alguno de los campos no cumple las reglas definidas, Zod genera
 * un error de validación con el mensaje correspondiente.
 */
export const RegisterSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'La contraseña debe contener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
    .regex(/[0-9]/, 'Debe contener al menos un numero'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
})

/**
 * Esquema de validación para el inicio de sesión de un usuario.
 *
 * Verifica que las credenciales proporcionadas tengan el formato
 * esperado antes de procesar el inicio de sesión.
 *
 * Campos:
 * - email: Debe ser una dirección de correo electrónico válida.
 * - password: Campo obligatorio. Debe contener al menos un carácter.
 *
 * La validación no comprueba si las credenciales son correctas
 * en la base de datos; únicamente verifica que los datos recibidos
 * cumplan con las reglas de formato establecidas.
 */
export const LoginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
