<script setup lang="ts">
import { ref } from 'vue'
import { createReservation } from '@/services/reservations'
import { X, CalendarDays, Clock } from 'lucide-vue-next'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const props = defineProps<{
  deskId: string
  deskCode: string
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const date = ref('')
const startTime = ref('')
const endTime = ref('')
const error = ref('')
const loading = ref(false)

/**
 * Gestiona el envío del formulario de creación de una reserva.
 *
 * Activa el estado de carga, limpia errores previos y solicita la creación
 * de la reserva con los datos seleccionados por el usuario. Si la operación
 * es exitosa, emite el evento `success` para notificar al componente padre.
 *
 * En caso de error, muestra el mensaje devuelto por la API o un mensaje
 * genérico como alternativa. El estado de carga se desactiva siempre,
 * independientemente de que la operación sea exitosa o falle.
 */
async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    await createReservation({
      deskId: props.deskId,
      date: date.value,
      startTime: startTime.value,
      endTime: endTime.value,
    })

    emit('success')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Error al crear la reserva'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Reservar escritorio</h2>
          <p class="text-sm text-gray-500 mt-0.5">Puesto {{ deskCode }}</p>
        </div>
        <button
          @click="emit('close')"
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
      >
        {{ error }}
      </div>

      <div class="space-y-5">
        <div>
          <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <CalendarDays class="w-4 h-4 text-gray-400" />
            Fecha
          </label>
          <input
            v-model="date"
            type="date"
            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Clock class="w-4 h-4 text-gray-400" />
              Hora inicio
            </label>
            <input
              v-model="startTime"
              type="time"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label class="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Clock class="w-4 h-4 text-gray-400" />
              Hora fin
            </label>
            <input
              v-model="endTime"
              type="time"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <button
          @click="handleSubmit"
          :disabled="loading || !date || !startTime || !endTime"
          class="w-full py-2.5 px-4 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <AppSpinner v-if="loading" size="sm" />
          <span v-else>Confirmar reserva</span>
        </button>
      </div>
    </div>
  </div>
</template>
