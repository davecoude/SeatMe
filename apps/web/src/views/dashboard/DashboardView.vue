<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { fetchZones } from '@/services/zones'
  import { fetchDesks } from '@/services/desks'
  import ReservationModal from '@/components/reservation/ReservationModal.vue'
  import { useToast } from '@/composables/useToast'


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
  const desks =  ref<Desk[]>([])
  const selectedZone = ref<string | null>(null)
  const selectedDesk = ref<Desk | null>(null)
  const loading = ref(false)
  const error = ref('')
  const toast = useToast()

  // montar las zonas para el dashboard
  onMounted(async () => {
    try {

      zones.value = await fetchZones()
      desks.value = await fetchDesks()

      // seleccionar primera zona por defecto
      if(zones.value.length > 0) {
        selectedZone.value = zones.value[0].id
      }

    } catch (e: any) {
      error.value = 'Error al cargar los datos'
    } finally {
      loading.value = false
    }
  })

  // desks filtrados por zona seleccionada
  const filteredDesk = computed(() => {
    if(!selectedZone.value) return []
    return desks.value.filter(desk => desk.zoneId === selectedZone.value)
  })

  function getStatusColor(status: string) {
    return status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" 
  }

  function getStatusLabel(status: string) {
    return status === "AVAILABLE" ? "Disponible" : "Mantenimiento"
  }

  function handleDeskClick(desk: Desk) {
    if(desk.status !== 'AVAILABLE') return
    selectedDesk.value = desk
  }

  function handleReservationSuccess() {
    selectedDesk.value = null
    toast.success('Reserva creada exitosamente')
  }

</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- loading state -->
    <div v-if="loading" class="text-gray-500">Cargando...</div>

    <!-- error state -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded"> {{ error }}</div>

    <!-- content -->
    <div v-else>
      <div class="flex gap-3 mb-6">
        <button
          v-for="zone in zones"
          :key="zone.id"
          @click="selectedZone = zone.id"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              selectedZone === zone.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ zone.name }} - Piso {{ zone.floor }}
        </button>
      </div>

      <!-- desk grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="desk in filteredDesk"
          :key="desk.id"
          @click="handleDeskClick(desk)"
          :class="[
            'p-4 bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow',
            desk.status === 'AVAILABLE' ? 'hover:shadow-md cursor-pointer': 'opacity-50 cursor-not-allowed'
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-lg">{{ desk.code }}</span>
            <span :class="['text-xs px-2 py-1 rounded-full', getStatusColor(desk.status)]">{{ getStatusLabel(desk.status) }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="filteredDesk.length === 0 && selectedZone"
        class="text-gray-500 text-center py-8"
      >
        No hay puestos en esta zona
      </div>
    </div>

    <ReservationModal
      v-if="selectedDesk"
      :desk-id="selectedDesk.id"
      :desk-code="selectedDesk.code"
      @close="selectedDesk = null"
      @success="handleReservationSuccess"
    />
  </div>
</template>