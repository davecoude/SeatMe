import api from './api'

/**
 * Sube la imagen del avatar del usuario autenticado al servidor.
 * 
 * Crea un FormData para enviar el archivo mediante una solicitud
 * multipart/form-data y devuelve la respuesta del servidor.
 * 
 * @param file - Archivo de imagen seleccionado por el usuario.
 * 
 * @returns Datos del usuario devueltos por el servidor.
*/
export async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

/**
 * Obtiene el perfil del usuario autenticado.
 * 
 * Realiza una solicitud GET al endpoint /users/me y devuelve
 * los datos del perfil recibidos del servidor.
 * 
 * @returns Datos del perfil del usuario.
*/
export async function getProfile() {
  const response = await api.get('/users/me')
  return response.data
}
