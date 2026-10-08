<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import {
  Monitor,
  CalendarCheck,
  Shield,
  ChevronRight,
  Clock,
  UserCheck,
  Laptop,
} from 'lucide-vue-next'

const heroRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from('.hero-title', { autoAlpha: 0, y: 30, duration: 0.8, ease: 'power3.out' })
  gsap.from('.hero-subtitle', {
    autoAlpha: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
  })
  gsap.from('.hero-cta', { autoAlpha: 0, y: 20, duration: 0.8, delay: 0.4, ease: 'power3.out' })
  gsap.from('.hero-image', {
    autoAlpha: 0,
    scale: 0.95,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
  })

  gsap.from('.feature-card', {
    autoAlpha: 0,
    y: 40,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: featuresRef.value,
  })

  gsap.from('.step-item', {
    autoAlpha: 0,
    x: -30,
    duration: 0.6,
    stagger: 0.2,
    delay: 0.5,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="bg-white">
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span class="text-xl font-bold text-primary-700">SeatMe</span>
        <div class="flex items-center gap-3">
          <RouterLink
            to="/login"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
          >
            Iniciar sesión
          </RouterLink>
          <RouterLink
            to="/register"
            class="px-4 py-2 text-sm font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
          >
            Registrarse
          </RouterLink>
        </div>
      </div>
    </nav>

    <section ref="heroRef" class="pt-28 pb-16 px-6">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 class="hero-title text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            El coworking inteligente
            <span class="text-primary-700">empieza aquí</span>
          </h1>
          <p class="hero-subtitle mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
            Reserva tu escritorio ideal en segundos. Consulta disponibilidad en tiempo real, elige
            tu zona y trabaja donde mejor te funcione.
          </p>
          <div class="hero-cta mt-8 flex items-center gap-4">
            <RouterLink
              to="/register"
              class="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
            >
              Comienza gratis
              <ChevronRight class="w-4 h-4" />
            </RouterLink>
            <RouterLink
              to="/login"
              class="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-medium hover:text-primary-700 transition-colors"
            >
              Ya tengo cuenta
            </RouterLink>
          </div>
        </div>
        <div class="hero-image">
          <img
            src="/images/hero.jpg"
            alt="Espacio de coworking moderno"
            class="rounded-2xl shadow-lg w-full object-cover max-h-[480px]"
          />
        </div>
      </div>
    </section>

    <section ref="featuresRef" class="py-20 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl font-bold text-gray-900">
            Todo lo que necesitas para trabajar mejor
          </h2>
          <p class="mt-3 text-gray-500 max-w-2xl mx-auto">
            SeatMe simplifica la gestión de espacios de trabajo compartidos para equipos y
            profesionales independientes.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="feature-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <CalendarCheck class="w-5 h-5 text-primary-700" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Reserva instantánea</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Selecciona zona, escritorio, fecha y horario. Tu puesto queda reservado al instante.
            </p>
          </div>

          <div
            class="feature-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <Monitor class="w-5 h-5 text-primary-700" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Escritorios equipados</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Cada puesto muestra sus amenities: monitor, standing desk, headset y más.
            </p>
          </div>

          <div
            class="feature-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <Shield class="w-5 h-5 text-primary-700" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Sin conflictos</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Detección automática de solapamientos. Nadie reserva tu puesto mientras lo usas.
            </p>
          </div>

          <div
            class="feature-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
              <Laptop class="w-5 h-5 text-primary-700" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Panel de control</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Administra zonas, escritorios, reservas y usuarios desde un panel centralizado.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section ref="stepsRef" class="py-20 px-6">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-10">Reserva en tres pasos</h2>

          <div class="space-y-8">
            <div class="step-item flex items-start gap-4">
              <div
                class="w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              >
                1
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Elige tu zona y escritorio</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                  Navega por las zonas del coworking y selecciona el puesto que mejor se adapte a tu
                  jornada.
                </p>
              </div>
            </div>

            <div class="step-item flex items-start gap-4">
              <div
                class="w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              >
                2
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Selecciona fecha y horario</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                  Escoge el día y la franja horaria. El sistema valida disponibilidad en tiempo
                  real.
                </p>
              </div>
            </div>

            <div class="step-item flex items-start gap-4">
              <div
                class="w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              >
                3
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Confirma y trabaja</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                  Haz check-in al llegar y tu puesto queda asegurado. Así de simple.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <img
            src="/images/coworking.jpg"
            alt="Personas trabajando en coworking"
            class="rounded-2xl shadow-lg w-full object-cover max-h-[440px]"
          />
        </div>
      </div>
    </section>

    <section ref="ctaRef" class="py-20 px-6 bg-primary-900">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Tu próximo día productivo empieza con un clic
        </h2>
        <p class="text-primary-300 mb-8 max-w-xl mx-auto">
          Únete a SeatMe y olvídate de buscar dónde sentarte. Tu escritorio te espera.
        </p>
        <RouterLink
          to="/register"
          class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-primary-50 transition-colors"
        >
          Crear cuenta gratis
          <ChevronRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </section>

    <footer class="py-8 px-6 border-t border-gray-200">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <span class="text-sm text-gray-500">© 2026 SeatMe. Todos los derechos reservados.</span>
        <div class="flex items-center gap-6">
          <a href="#" class="text-sm text-gray-500 hover:text-primary-700 transition-colors"
            >Términos</a
          >
          <a href="#" class="text-sm text-gray-500 hover:text-primary-700 transition-colors"
            >Privacidad</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero-title,
.hero-subtitle,
.hero-cta,
.hero-image,
.feature-card,
.step-item {
  visibility: hidden;
}
</style>
