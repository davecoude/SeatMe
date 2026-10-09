<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { uploadAvatar } from '@/services/users'
import { useToast } from '@/composables/useToast'
import { Camera, User } from 'lucide-vue-next'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const auth = useAuthStore()
const toast = useToast()
const uploading = ref(false)
const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function openFileDialog() {
  fileInput.value?.click()
}

/**
 * Gestiona la selección de una imagen desde el input de archivos.
 * 
 * Genera una vista previa local y comienza la subida del archivo.
 * 
 * @param event - Evento generado al seleccionar un archivo.
*/
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Preview antes de subir
  preview.value = URL.createObjectURL(file)
  handleUpload(file)
}

/**
 * Sube la imagen de perfil al servidor y actualiza los datos del usuario.
 * 
 * Gestiona los estados de carga, éxito y error durante la operación.
 * 
 *  @param file - Archivo de imagen seleccionado por el usuario.
*/
async function handleUpload(file: File) {
  try {
    uploading.value = true
    const user = await uploadAvatar(file)
    auth.user = { ...auth.user, ...user }
    toast.success('Foto de perfil actualizada')
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al subir imagen')
    preview.value = null
  } finally {
    uploading.value = false
  }
}

const avatarUrl = ref(auth.user?.avatarUrl || null)
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <div class="bg-white rounded-xl border border-gray-200 p-8">
        <!-- Avatar section -->
        <div class="flex flex-col items-center mb-8">
          <div class="relative group cursor-pointer" @click="openFileDialog">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                v-if="preview || auth.user?.avatarUrl"
                :src="preview || auth.user?.avatarUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <User v-else class="w-10 h-10 text-gray-400" />
            </div>

            <!-- Overlay de hover -->
            <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera v-if="!uploading" class="w-6 h-6 text-white" />
              <AppSpinner v-else size="sm" />
            </div>
          </div>

          <p class="mt-3 text-sm text-gray-500">Clic para cambiar foto</p>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- User info -->
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Nombre</span>
            <span class="text-sm font-medium text-gray-900">{{ auth.user?.firstName }}</span>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Email</span>
            <span class="text-sm font-medium text-gray-900">{{ auth.user?.email || '—' }}</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-sm text-gray-500">Rol</span>
            <span class="text-sm font-medium text-gray-900">
              {{ auth.user?.role === 'ADMIN' ? 'Administrador' : 'Miembro' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>