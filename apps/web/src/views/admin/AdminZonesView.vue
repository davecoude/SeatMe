<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchZones, createZone, updateZone, deleteZone } from '@/services/zones';
import { useToast } from '@/composables/useToast';

interface Zone {
  id: string
  name: string
  description: string
  floor: number
}

const zones = ref<Zone[]>([])
const loading = ref(true)
const toast = useToast()

// Estado del modal
const showModal = ref(false)
const editingZone = ref<Zone | null>(null)
const form = ref({ name: '', description: '', floor: 1 })

onMounted(async () => {
  await loadZones()
})

/**
 * Carga todas las zonas registradas en el sistema.
 *
 * Actualiza el estado de carga mientras se realiza la petición y
 * muestra una notificación si ocurre un error.
 *
 * @returns Una promesa que se resuelve cuando las zonas han sido cargadas.
 */
async function loadZones() {
  try {
    loading.value = true
    zones.value = await fetchZones()
  } catch {
    toast.error('Error al cargar zonas')
  } finally {
    loading.value = false
  }
}

/**
 * Abre el modal para crear una nueva zona.
 *
 * Reinicia el formulario con sus valores iniciales y establece el modo
 * de creación eliminando cualquier zona seleccionada para edición.
 */
function openCreateModal() {
  editingZone.value = null
  form.value = { name: '', description: '', floor: 1 }
  showModal.value = true
}

/**
 * Abre el modal para editar una zona existente.
 *
 * Carga los datos de la zona seleccionada en el formulario y establece
 * el modo de edición.
 *
 * @param zone - Zona que se desea editar.
 */
function openEditModal(zone: Zone) {
  editingZone.value = zone
  form.value = {
    name: zone.name,
    description: zone.description,
    floor: zone.floor
  }
  showModal.value = true
}

/**
 * Procesa el formulario de creación o actualización de una zona.
 *
 * Si existe una zona seleccionada para edición, actualiza sus datos.
 * De lo contrario, crea una nueva zona. Después de completar la operación,
 * cierra el modal y recarga la lista de zonas.
 */
async function handleSubmit() {
  try {
    if(editingZone.value) {
      await updateZone(editingZone.value.id, form.value)
      toast.success('Zona actualizada')
    } else {
      await createZone(form.value)
      toast.success('Zona creada')
    }

    showModal.value = false
    await loadZones()
    
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al guardar zona')
  }
}

/**
 * Elimina una zona después de solicitar confirmación al usuario.
 *
 * Si la eliminación es exitosa, muestra una notificación de confirmación.
 *
 * @param zone - Zona que se desea eliminar.
 */
async function handleDelete(zone: Zone) {
  if(!confirm(`Eliminar la zona "${zone.name}"?`)) return

  try {
    await deleteZone(zone.id)
    toast.success('Zona eliminada')
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al eliminar zona')
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Gestion de Zonas</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
      >
        Nueva Zona
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Cargando...</div>

    <div v-else-if="zones.length === 0" class="text-center py-12 text-gray-500">
      No hay zonas registradas
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="zone in zones"
        :key="zone.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between"
      >
        <div>
          <span class="font-bold">{{ zone.name }}</span>
          <span class="text-sm text-gray-500 ml-2">{{zone.floor}}</span>
          <p class="text-sm text-gray-600 mt-1">{{ zone.description }}</p>
        </div>

        <div class="flex gap-2">
          <button
            @click="openEditModal(zone)"
            class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Editar
          </button>
          <button
            @click="handleDelete(zone)"
            class="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">
            {{ editingZone ? 'Editar Zona' : 'Nueva Zona' }}
          </h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Zona Norte"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area tranquila junto a la ventana"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Piso</label>
            <input
              v-model.number="form.floor"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area tranquila junto a la ventana"
            />
          </div>

          <button
            @click="handleSubmit"
            :disabled="!form.name"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ editingZone ? 'Guardar cambios' : 'Crear zona' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>