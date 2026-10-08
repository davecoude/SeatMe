import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

/**
 * Decodifica el payload de un token JWT.
 *
 * Extrae la sección central del token y la convierte desde Base64
 * a un objeto JavaScript.
 *
 * @param token - Token JWT que se desea decodificar.
 *
 * @returns El payload decodificado del token o `null` si el token
 *          no tiene un formato válido.
 */
function decodeToken(token: string) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(decodeToken(token.value || ''))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const userRole = computed(() => user.value?.role || null)

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.token
    user.value = decodeToken(response.data.token)
    localStorage.setItem('token', response.data.token)
  }

  async function register(email: string, password: string, firstName: string, lastName: string) {
    const response = await api.post('/auth/register', { email, password, firstName, lastName })
    return response
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, isAdmin, userRole, login, register, logout }
})
