import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import MyReservationsView from '@/views/reservations/MyReservationsView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminZonesView from '@/views/admin/AdminZonesView.vue'
import AdminDesksView from '@/views/admin/AdminDesksView.vue'
import AdminReservationsView from '@/views/admin/AdminReservationsView.vue'
import LandingView from '@/views/landing/LandingView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/my-reservations',
      name: 'reservations',
      component: MyReservationsView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/zones',
      name: 'admin-zones',
      component: AdminZonesView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/desks',
      name: 'admin-desks',
      component: AdminDesksView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/reservations',
      name: 'admin-reservations',
      component: AdminReservationsView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
  ],
})

/**
 * Route guards
 */
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  // rutas que no requieren autenticacion
  const publicRoutes = ['landing', 'login', 'register']

  // Si requiere auth y no hay token. Redirige -> login
  if (!publicRoutes.includes(to.name as string) && !token) {
    return { name: 'login' }
  }

  // Si esta autenticado y va a register o login. Redirige -> dashboard
  if (publicRoutes.includes(to.name as string) && token) {
    if (to.name === 'landing') return { name: 'dashboard' }
    return { name: 'dashboard' }
  }

  // Guard admin - decodificacion del token para verificar rol
  if (to.meta.requiresAdmin) {
    try {
      const tokenParts = token?.split('.')
      const payload = JSON.parse(atob(tokenParts?.[1] ?? ''))
      if (payload.role !== 'ADMIN') {
        return { name: 'dashboard' }
      }
    } catch {
      return { name: 'login' }
    }
  }
})

export default router
