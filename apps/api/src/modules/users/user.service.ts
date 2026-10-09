import { prisma } from '../../config/database.js'
import { supabase } from '../../config/supabase.js'

/**
 * Sube una imagen de avatar al bucket de Supabase Storage
 * y actualiza la URL en el perfil del usuario.
 *
 * @param userId - ID del usuario
 * @param file - Archivo recibido por multer
 * @returns El usuario actualizado con la nueva avatarUrl
 * @throws Error si el upload falla
 */
export async function uploadAvatar(
  userId: string,
  file: { buffer: Buffer; mimetype: string; originalname: string },
) {
  // Nombre unico para generar colisiones
  const extension = file.originalname.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${extension}`
  const filePath = `avatars/${fileName}`

  // Subir a supabase storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    })

  if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`)

  // Obtener la URL publica
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Actualizar usuario en la bd
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: urlData.publicUrl },
    select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
  })

  return user
}

/**
 * Obtiene el perfil del usuario sin el password.
 *
 * @param userId - ID del usuario
 * @returns Datos del usuario sin password
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, avatarUrl: true },
  })

  return user
}
