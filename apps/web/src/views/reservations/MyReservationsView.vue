<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchMyReservations, checkInReservation, cancelReservation } from '@/services/reservations'
  import { useToast } from '@/composables/useToast'

  interface Reservation {
    id: string
    date: string
    startTime: string
    endTime: string
    status: string
    checkInAt: string | null
    desk: {
      id: string
      code: string
      zone: {
        name: string
        floor: number
      }
    }
  }

  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const toast = useToast()

  onMounted(async () => {
    await loadReservations()
  })

  /**
   * Carga las reservas pertenecientes al usuario autenticado.
   *
   * Actualiza el estado de carga mientras se realiza la petición y
   * muestra una notificación si ocurre un error.
   *
   * @returns Una promesa que se resuelve cuando las reservas han sido cargadas.
   */
  async function loadReservations() {
    try {
      loading.value = true
      reservations.value = await fetchMyReservations()
    } catch (e: any) {
      toast.error('Error al cargar reservas')
    } finally {
      loading.value = false
    }
  }

  /**
   * Realiza el check-in de una reserva.
   *
   * Después de registrar el check-in, actualiza la lista de reservas
   * para reflejar el nuevo estado.
   *
   * @param id - Identificador de la reserva.
   */
  async function handleCheckIn(id: string) {
    try {
      await checkInReservation(id)
      toast.success('Check-in realizado')
      await loadReservations()
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Error al hacer check-in')
    }
  }

  /**
   * Cancela una reserva.
   *
   * Después de cancelar la reserva, actualiza la lista de reservas
   * para reflejar el nuevo estado.
   *
   * @param id - Identificador de la reserva que se desea cancelar.
   */
  async function handleCancel(id: string) {
    try {
      await cancelReservation(id)
      toast.success('Reserva cancelada')
      await loadReservations()
    } catch (e: any) {
      toast.error(e.response?.data?.error || `Error al cancelar`)
    }
  }

    /**
     * Obtiene las clases CSS correspondientes al estado de una reserva.
     *
     * @param status - Estado actual de la reserva.
     *
     * @returns Clases CSS utilizadas para representar visualmente el estado.
     */
  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'CHECKED_IN': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Obtiene la etiqueta en español correspondiente al estado de una reserva.
   *
   * @param status - Estado actual de la reserva.
   *
   * @returns Texto descriptivo del estado de la reserva.
   */
  function getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'CONFIRMED': return 'Confirmada'
      case 'CHECKED_IN': return 'En uso'
      case 'COMPLETED': return 'Completada'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  /**
   * Formatea una fecha para mostrarla en formato localizado de Colombia.
   *
   * @param dateStr - Fecha en formato de cadena.
   *
   * @returns Fecha formateada en español con día de la semana, año,
   *          mes y día.
   */
  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Mis reservas</h1>

    <div v-if="loading" class="text-gray-500">Cargando...</div>

    <div v-else-if="reservations.length === 0" class="text-center py-12 text-gray-500">No tienes reservas aun</div>

    <div v-else class="space-y-4">
      <div
        v-for="reservation in reservations"
        :key="reservation.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm p-5"
      >
        <div class="flex items-start justify-between">
          <!-- Info de la reserva -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="font-bold text-lg">{{ reservation.desk.code }}</span>
              <span :class="['text-sm px-2 py-1 rounded-full', getStatusColor(reservation.status)]">{{ getStatusLabel(reservation.status) }}</span>
            </div>
            <p class="text-sm text-gray-600"> {{ reservation.desk.zone.name }} - Piso {{ reservation.desk.zone.floor }}</p>
            <p class="text-sm text-gray-600 mt-1"> {{formatDate(reservation.date)}} · {{ reservation.startTime }} - {{reservation.endTime}}</p>
          </div>

          <!-- Acciones -->
           <div class="flex gap-2">
            <button
              v-if="reservation.status === 'CONFIRMED'"
              @click="handleCheckIn(reservation.id)"
              class="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Check-in
            </button>

            <button
              v-if="reservation.status === 'CONFIRMED' || reservation.status === 'PENDING'"
              @click="handleCancel(reservation.id)"
              class="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Cancelar
            </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>