import { createRouter, createWebHistory } from "vue-router"
import LoginView from "@/views/auth/LoginView.vue"
import RegisterView from "@/views/auth/RegisterView.vue"
import DashboardView from "@/views/dashboard/DashboardView.vue"
import MyReservationsView from "@/views/reservations/MyReservationsView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/my-reservations",
      name: "reservations",
      component: MyReservationsView
    }
  ]
})

/**
 * Route guards
 */
router.beforeEach((to) => {
  const token = localStorage.getItem("token")

  // rutas que no requieren autenticacion
  const publicRoutes  = ["login","register"]

  // Si requiere auth y no hay token. Redirige -> login
  if(!publicRoutes.includes(to.name as string) && !token) {
    return { name: "login"}
  }

  // Si esta autenticado y va a register o login. Redirige -> dashboard
  if(publicRoutes.includes(to.name as string) && token) {
    return { name: "dashboard"}
  }
})

export default router