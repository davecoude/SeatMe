<script setup lang="ts">
  import { ref } from 'vue'
  import { createReservation } from '@/services/reservations'

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

  async function handleSubmit() {
    try {
      
      loading.value = true
      error.value = ''

      await createReservation({
        deskId: props.deskId,
        date: date.value,
        startTime: startTime.value,
        endTime: endTime.value
      })

      emit('success')

    } catch (e: any) {
      error.value = e.response?.data?.error || "Error al crear la reserva"
    } finally {
      loading.value = false
    }
  }

</script>

<template>
   <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
     <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Reservar puesto {{ deskCode }}</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{{ error }}</div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            v-model="date"
            type="date"
            class="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
            <input
              v-model="startTime"
              type="time"
              class="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
            <input
              v-model="endTime"
              type="time"
              class="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          @click="handleSubmit"
          :disabled="loading || !date || !startTime || !endTime"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Reservando...' : 'Confirmar reserva' }}
        </button>
      </div>
     </div>
   </div>
</template>