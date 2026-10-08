<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { fetchZones, createZone, updateZone, deleteZone } from '@/services/zones'
import { useToast } from '@/composables/useToast'
import { Plus, Pencil, Trash2, Map, X, Building } from 'lucide-vue-next'
import gsap from 'gsap'
import AppSpinner from '@/components/ui/AppSpinner.vue'

interface Zone {
  id: string
  name: string
  description: string | null
  floor: number
}

const zones = ref<Zone[]>([])
const loading = ref(true)
const toast = useToast()

const showModal = ref(false)
const editingZone = ref<Zone | null>(null)
const form = ref({ name: '', description: '', floor: 1 })
const submitting = ref(false)

onMounted(async () => {
  await loadZones()
})

async function loadZones() {
  try {
    loading.value = true
    zones.value = await fetchZones()

    await nextTick()
    gsap.fromTo('.zone-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
    )
  } catch {
    toast.error('Error al cargar zonas')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingZone.value = null
  form.value = { name: '', description: '', floor: 1 }
  showModal.value = true
}

function openEditModal(zone: Zone) {
  editingZone.value = zone
  form.value = {
    name: zone.name,
    description: zone.description || '',
    floor: zone.floor
  }
  showModal.value = true
}

async function handleSubmit() {
  try {
    submitting.value = true
    if (editingZone.value) {
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
  } finally {
    submitting.value = false
  }
}

async function handleDelete(zone: Zone) {
  if (!confirm(`¿Eliminar la zona "${zone.name}"?`)) return

  try {
    await deleteZone(zone.id)
    toast.success('Zona eliminada')
    await loadZones()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al eliminar zona')
  }
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Zonas</h1>
          <p class="mt-1 text-sm text-gray-500">Administra las zonas del coworking</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Nueva Zona
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <div v-else-if="zones.length === 0" class="text-center py-16">
        <Map class="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p class="font-medium text-gray-500">No hay zonas registradas</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="zone-card bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Building class="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">{{ zone.name }}</h3>
                  <span class="text-xs text-gray-500">Piso {{ zone.floor }}</span>
                </div>
              </div>
            </div>
            <p v-if="zone.description" class="text-sm text-gray-500 mt-2 leading-relaxed">
              {{ zone.description }}
            </p>
          </div>

          <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              @click="openEditModal(zone)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Pencil class="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              @click="handleDelete(zone)"
              class="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">
              {{ editingZone ? 'Editar Zona' : 'Nueva Zona' }}
            </h2>
            <button @click="showModal = false" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Zona Norte"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
              <input
                v-model="form.description"
                type="text"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Área tranquila junto a la ventana"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Piso</label>
              <input
                v-model.number="form.floor"
                type="number"
                min="1"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              @click="handleSubmit"
              :disabled="!form.name || submitting"
              class="w-full py-2.5 px-4 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <AppSpinner v-if="submitting" size="sm" />
              <span v-else>{{ editingZone ? 'Guardar cambios' : 'Crear zona' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>