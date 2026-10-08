<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { fetchDesks, createDesk, updateDesk, deleteDesk } from '@/services/desks'
import { fetchZones } from '@/services/zones'
import { useToast } from '@/composables/useToast'
import { Plus, Pencil, Trash2, Monitor, X, MapPin } from 'lucide-vue-next'
import gsap from 'gsap'
import AppSpinner from '@/components/ui/AppSpinner.vue'

type DeskStatus = 'AVAILABLE' | 'MAINTENANCE'

interface Desk {
  id: string
  code: string
  zoneId: string
  status: DeskStatus
  posX: number
  posY: number
}

interface Zone {
  id: string
  name: string
  description: string | null
  floor: number
}

const desks = ref<Desk[]>([])
const zones = ref<Zone[]>([])
const loading = ref(true)
const toast = useToast()
const selectedZone = ref<string>('all')

const showModal = ref(false)
const editingDesk = ref<Desk | null>(null)
const submitting = ref(false)
const form = ref<Omit<Desk, 'id'>>({
  code: '',
  zoneId: '',
  status: 'AVAILABLE',
  posX: 0,
  posY: 0,
})

/**
 * Inicializa los datos necesarios para mostrar la gestión de escritorios.
 *
 * Carga los escritorios y las zonas disponibles, activa el estado de carga
 * durante el proceso y ejecuta la animación de entrada de las tarjetas una
 * vez actualizado el DOM. Si ocurre un error, muestra una notificación al usuario.
 */
onMounted(async () => {
  try {
    loading.value = true
    desks.value = await fetchDesks()
    zones.value = await fetchZones()

    await nextTick()
    gsap.fromTo(
      '.desk-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
    )
  } catch {
    toast.error('Error al cargar datos')
  } finally {
    loading.value = false
  }
})

const filteredDesks = computed(() => {
  if (selectedZone.value === 'all') return desks.value
  return desks.value.filter((desk) => desk.zoneId === selectedZone.value)
})

/**
 * Recarga la lista de escritorios y aplica la animación de entrada
 * después de que el DOM haya sido actualizado.
 */
async function loadDesks() {
  try {
    desks.value = await fetchDesks()

    await nextTick()
    gsap.fromTo(
      '.desk-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
    )
  } catch {
    toast.error('Error al cargar escritorios')
  }
}

/**
 * Obtiene el nombre de la zona asociada a un escritorio.
 *
 * @param zoneId - Identificador de la zona que se desea buscar.
 * @returns Nombre de la zona o "Sin zona" si no existe una coincidencia.
 */
function getZoneName(zoneId: string) {
  const zone = zones.value.find((z) => z.id === zoneId)
  return zone ? zone.name : 'Sin zona'
}

/**
 * Prepara el formulario para crear un nuevo escritorio y abre el modal.
 */
function openCreateModal() {
  editingDesk.value = null
  form.value = { code: '', zoneId: '', status: 'AVAILABLE', posX: 0, posY: 0 }
  showModal.value = true
}

/**
 * Prepara el formulario con los datos del escritorio seleccionado
 * y abre el modal en modo edición.
 *
 * @param desk - Escritorio cuyos datos serán cargados en el formulario.
 */
function openEditModal(desk: Desk) {
  editingDesk.value = desk
  form.value = {
    code: desk.code,
    zoneId: desk.zoneId,
    status: desk.status,
    posX: desk.posX,
    posY: desk.posY,
  }
  showModal.value = true
}

/**
 * Gestiona la creación o actualización de un escritorio según el modo
 * actual del formulario.
 *
 * Si existe un escritorio en edición, lo actualiza; de lo contrario,
 * crea uno nuevo. Después de completar la operación, cierra el modal
 * y recarga la lista de escritorios.
 */
async function handleSubmit() {
  try {
    submitting.value = true
    if (editingDesk.value) {
      await updateDesk(editingDesk.value.id, form.value)
      toast.success('Escritorio actualizado')
    } else {
      await createDesk(form.value)
      toast.success('Escritorio creado')
    }
    showModal.value = false
    await loadDesks()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al guardar escritorio')
  } finally {
    submitting.value = false
  }
}

/**
 * Elimina un escritorio después de solicitar confirmación al usuario.
 *
 * @param desk - Escritorio que se desea eliminar.
 */
async function handleDelete(desk: Desk) {
  if (!confirm(`¿Eliminar el escritorio "${desk.code}"?`)) return

  try {
    await deleteDesk(desk.id)
    toast.success('Escritorio eliminado')
    await loadDesks()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al eliminar escritorio')
  }
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Escritorios</h1>
          <p class="mt-1 text-sm text-gray-500">Administra los puestos de trabajo</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Nuevo Escritorio
        </button>
      </div>

      <!-- Zone filter -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          @click="selectedZone = 'all'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
            selectedZone === 'all'
              ? 'bg-primary-700 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700',
          ]"
        >
          Todas
        </button>
        <button
          v-for="zone in zones"
          :key="zone.id"
          @click="selectedZone = zone.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
            selectedZone === zone.id
              ? 'bg-primary-700 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700',
          ]"
        >
          {{ zone.name }}
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <div v-else-if="filteredDesks.length === 0" class="text-center py-16">
        <Monitor class="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p class="font-medium text-gray-500">No hay escritorios registrados</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="desk in filteredDesks"
          :key="desk.id"
          class="desk-card bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-lg font-bold text-gray-900">{{ desk.code }}</span>
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  desk.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ desk.status === 'AVAILABLE' ? 'Disponible' : 'Mantenimiento' }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin class="w-4 h-4 text-gray-400" />
              {{ getZoneName(desk.zoneId) }}
            </div>
          </div>

          <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              @click="openEditModal(desk)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Pencil class="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              @click="handleDelete(desk)"
              class="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      >
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">
              {{ editingDesk ? 'Editar Escritorio' : 'Nuevo Escritorio' }}
            </h2>
            <button
              @click="showModal = false"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Código</label>
              <input
                v-model="form.code"
                type="text"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="N-05"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Zona</label>
              <select
                v-model="form.zoneId"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="" disabled>Selecciona una zona</option>
                <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                  {{ zone.name }} — Piso {{ zone.floor }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
              <select
                v-model="form.status"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="MAINTENANCE">Mantenimiento</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Pos X</label>
                <input
                  v-model.number="form.posX"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Pos Y</label>
                <input
                  v-model.number="form.posY"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <button
              @click="handleSubmit"
              :disabled="!form.code || !form.zoneId || submitting"
              class="w-full py-2.5 px-4 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <AppSpinner v-if="submitting" size="sm" />
              <span v-else>{{ editingDesk ? 'Guardar cambios' : 'Crear escritorio' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
