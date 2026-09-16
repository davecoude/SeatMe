import { ref, computed } from "vue"
import { defineStore } from "pinia"
import api from "@/services/api"


export const useAuthStore = defineStore("auth", () => {

  const token = ref<string | null>(localStorage.getItem("token"))
  const user = ref<any>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password })
    token.value = response.data.token
    localStorage.setItem("token", response.data.token)
  }

  async function register(email: string, password: string, firstName: string, lastName: string) {
    const response = await api.post("/auth/register", { email, password, firstName, lastName })
    return response
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem("token")
  }

  return { token, user, isAuthenticated, login, register, logout }
})