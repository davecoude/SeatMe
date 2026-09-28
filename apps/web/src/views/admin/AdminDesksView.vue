<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchDesks, createDesk, updateDesk, deleteDesk } from '@/services/desks';
  import { fetchZones } from '@/services/zones';
  import { useToast } from '@/composables/useToast';

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
    description: string
    floor: number
  }

  const desks = ref<Desk[]>([])
  const zones = ref<Zone[]>([])
  const loading = ref(false)
  const toast = useToast()

  // Estado del modal
  const showModal = ref(false)
  const editingDesk = ref<Desk | null>(null)
  const form = ref<Omit<Desk, 'id'>>({
    code: '',
    zoneId: '',
    status: 'AVAILABLE',
    posX: 0,
    posY: 0
  })

  onMounted(async () => {
    await loadDesks()
    zones.value = await fetchZones()
  })

  /**
   * Carga la lista de escritorios desde el servidor.
   *
   * Actualiza el estado de carga mientras se realiza la petición y
   * muestra una notificación en caso de error.
   *
   * @returns Una promesa que se resuelve cuando los escritorios han sido cargados.
   */
  async function loadDesks() {
    try {
      loading.value = true
      desks.value = await fetchDesks()
    } catch {
      toast.error('Error al cargar escritorio')
    } finally {
      loading.value = false
    }
  }

  /**
   * Abre el modal para crear un nuevo escritorio.
   *
   * Reinicia el formulario con sus valores iniciales y establece el modo
   * de creación eliminando cualquier escritorio seleccionado para edición.
   */
  function openCreateModal() {
    editingDesk.value = null
    form.value = { code: '', zoneId: '', status: 'AVAILABLE', posX: 0, posY: 0 }
    showModal.value = true
  }

  /**
   * Abre el modal para editar un escritorio existente.
   *
   * Carga los datos del escritorio seleccionado en el formulario
   * y establece el modo de edición.
   *
   * @param desk - Escritorio que se desea editar.
   */
  function openEditModal(desk: Desk) {
    editingDesk.value = desk
    form.value = {
      code: desk.code,
      zoneId: desk.zoneId,
      status: desk.status,
      posX: desk.posX,
      posY: desk.posY
    }
    showModal.value = true
  }

  /**
   * Procesa el formulario de creación o actualización de un escritorio.
   *
   * Si existe un escritorio seleccionado para edición, actualiza sus datos.
   * De lo contrario, crea un nuevo escritorio. Después de completar la
   * operación, cierra el modal y recarga la lista de escritorios.
   *
   * Muestra una notificación de éxito o error según el resultado de la operación.
   */
  async function handleSubmit() {
    try {

      if(editingDesk.value) {
        await updateDesk(editingDesk.value.id, form.value)
        toast.success('Escritorio actualizado')
      } else {
        await createDesk(form.value)
        toast.success('Escritorio creado')
      }

      showModal.value = false
      await loadDesks()
      
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Error al guardar el escritorio')
    }
  }

  /**
   * Elimina un escritorio después de solicitar confirmación al usuario.
   *
   * Si la eliminación es exitosa, muestra una notificación y actualiza
   * la lista de escritorios.
   *
   * @param desk - Escritorio que se desea eliminar.
   */
  async function handleDelete(desk: Desk) {
    if(!confirm(`Eliminar el escritorio "${desk.code}"?`)) return

    try {
      await deleteDesk(desk.id)
      toast.success('Escritorio eliminado')
      await loadDesks()

    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Error al eliminar escritorio')
    }
  }

  /**
 * Obtiene el nombre de una zona a partir de su identificador.
 *
 * @param zoneId - Identificador de la zona.
 *
 * @returns Nombre de la zona o `Sin zona` si no se encuentra.
 */
  function getZoneName(zoneId: string) {
    const zone = zones.value.find(z => z.id === zoneId)
    return zone ? zone.name : 'Sin zona'
  }
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Gestion de Escritorios</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
      >
        Nuevo Escritorio
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Cargando...</div>

    <div v-else-if="desks.length === 0" class="text-center py-12 text-gray-500">
      No hay escritorios registrados
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="desk in desks"
        :key="desk.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between"
      >
        <div>
          <span class="font-bold">{{ desk.code }}</span>
          <span class="text-sm text-gray-500 ml-2">{{desk.status}}</span>
          <p class="text-sm text-gray-600 mt-1">{{ getZoneName(desk.zoneId) }}</p>
        </div>

        <div class="flex gap-2">
          <button
            @click="openEditModal(desk)"
            class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Editar
          </button>
          <button
            @click="handleDelete(desk)"
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
            {{ editingDesk ? 'Editar Escritorio' : 'Crear Escritorio' }}
          </h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Codigo</label>
            <input
              v-model="form.code"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Zona Norte"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Zona</label>
            <select v-model="form.zoneId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option disabled>Selecciona una zona</option>
              <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option disabled>Selecciona el estado</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="MAINTENANCE">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pos X</label>
            <input
              v-model.number="form.posX"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Posicion horizontal"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pos Y</label>
            <input
              v-model.number="form.posY"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Posicion vertical"
            />
          </div>

          <button
            @click="handleSubmit"
            :disabled="!form.code"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ editingDesk ? 'Guardar cambios' : 'Crear escritorio' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>