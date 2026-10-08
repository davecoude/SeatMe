import { isFunctionTypeNode } from 'typescript'
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let nextId = 0

/**
 * Proporciona una interfaz para gestionar las notificaciones toast de la aplicación.
 *
 * Expone el estado de las notificaciones y métodos especializados para mostrar
 * mensajes de éxito, error y advertencia. Las notificaciones se eliminan
 * automáticamente después del tiempo definido.
 *
 * @returns Estado de las notificaciones y métodos para mostrar cada tipo de toast.
 */
export function useToast() {
  function showToast(message: string, type: ToastType = 'success', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  function success(message: string) {
    showToast(message, 'success')
  }

  function error(message: string) {
    showToast(message, 'error')
  }

  function warning(message: string) {
    showToast(message, 'warning')
  }

  return { toasts, success, error, warning }
}
