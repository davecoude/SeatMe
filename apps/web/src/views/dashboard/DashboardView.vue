<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { fetchZones } from '@/services/zones'
import { fetchDesks } from '@/services/desks'
import { useToast } from '@/composables/useToast'
import { MapPin, Monitor, AlertTriangle } from 'lucide-vue-next'
import gsap from 'gsap'
import ReservationModal from '@/components/reservation/ReservationModal.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

interface Zone {
  id: string
  name: string
  description: string | null
  floor: number
}

interface Desk {
  id: string
  code: string
  status: string
  posX: number
  posY: number
  zoneId: string
  zone: Zone
}

const zones = ref<Zone[]>([])
const desks = ref<Desk[]>([])
const selectedZone = ref<string | null>(null)
const selectedDesk = ref<Desk | null>(null)
const loading = ref(true)
const toast = useToast()

onMounted(async () => {
  try {
    zones.value = await fetchZones()
    desks.value = await fetchDesks()

    if (zones.value.length > 0) {
      selectZone(zones.value[0].id)
    }
  } catch (e: any) {
    toast.error('Error al cargar los datos')
  } finally {
    loading.value = false
  }
})

const filteredDesks = computed(() => {
  if (!selectedZone.value) return []
  return desks.value.filter((desk) => desk.zoneId === selectedZone.value)
})

const currentZone = computed(() => {
  return zones.value.find((z) => z.id === selectedZone.value) || null
})

const availableCount = computed(() => {
  return filteredDesks.value.filter((d) => d.status === 'AVAILABLE').length
})

const maintenanceCount = computed(() => {
  return filteredDesks.value.filter((d) => d.status === 'MAINTENANCE').length
})

async function selectZone(zoneId: string) {
  selectedZone.value = zoneId

  await nextTick()

  gsap.fromTo(
    '.desk-card',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0, stagger: 0.05, ease: 'power3.out' },
  )
}

function handleDeskClick(desk: Desk) {
  if (desk.status !== 'AVAILABLE') return
  selectedDesk.value = desk
}

function handleReservationSuccess() {
  selectedDesk.value = null
  toast.success('Reserva creada exitosamente')
}

function getMosaicClass(index: number): string {
  const pattern = index % 6
  if (pattern === 0) return 'col-span-2 row-span-2'
  if (pattern === 3) return 'col-span-2'
  return ''
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Selecciona una zona y reserva tu escritorio</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <template v-else>
        <!-- Zone tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            v-for="zone in zones"
            :key="zone.id"
            @click="selectZone(zone.id)"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              selectedZone === zone.id
                ? 'bg-primary-700 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700',
            ]"
          >
            <MapPin class="w-4 h-4" />
            {{ zone.name }}
            <span
              :class="[
                'text-xs px-1.5 py-0.5 rounded-full',
                selectedZone === zone.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
              ]"
            >
              Piso {{ zone.floor }}
            </span>
          </button>
        </div>

        <!-- Zone info bar -->
        <div
          v-if="currentZone"
          class="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h2 class="font-bold text-gray-900">{{ currentZone.name }}</h2>
            <p v-if="currentZone.description" class="text-sm text-gray-500 mt-0.5">
              {{ currentZone.description }}
            </p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <span class="flex items-center gap-1.5 text-green-700">
              <span class="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {{ availableCount }} disponibles
            </span>
            <span v-if="maintenanceCount > 0" class="flex items-center gap-1.5 text-gray-500">
              <span class="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
              {{ maintenanceCount }} en mantenimiento
            </span>
          </div>
        </div>

        <!-- Desk mosaic -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] gap-4">
          <div
            v-for="(desk, index) in filteredDesks"
            :key="desk.id"
            @click="handleDeskClick(desk)"
            :class="[
              'desk-card rounded-xl border p-5 flex flex-col justify-between transition-all',
              getMosaicClass(index),
              desk.status === 'AVAILABLE'
                ? 'bg-white border-gray-200 hover:border-primary-500 hover:shadow-md cursor-pointer'
                : 'bg-gray-100 border-gray-200 cursor-not-allowed',
            ]"
          >
            <div class="flex items-start justify-between">
              <span class="text-lg font-bold text-gray-900">{{ desk.code }}</span>
              <span
                :class="[
                  'text-xs font-medium px-2 py-1 rounded-full',
                  desk.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ desk.status === 'AVAILABLE' ? 'Disponible' : 'Mantenimiento' }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-gray-400">
              <Monitor v-if="desk.status === 'AVAILABLE'" class="w-4 h-4" />
              <AlertTriangle v-else class="w-4 h-4" />
              <span class="text-xs">{{
                desk.status === 'AVAILABLE' ? 'Clic para reservar' : 'No disponible'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredDesks.length === 0 && selectedZone"
          class="text-center py-16 text-gray-500"
        >
          <Monitor class="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p class="font-medium">No hay escritorios en esta zona</p>
        </div>
      </template>

      <!-- Reservation modal -->
      <ReservationModal
        v-if="selectedDesk"
        :desk-id="selectedDesk.id"
        :desk-code="selectedDesk.code"
        @close="selectedDesk = null"
        @success="handleReservationSuccess"
      />
    </div>
  </div>
</template>
