<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()

function getToastClasses(type: string) {
  switch (type) {
    case 'success': return 'bg-green-600 text-white'
    case 'error': return 'bg-red-600 text-white'
    case 'warning': return 'bg-yellow-500 text-white'
    default: return 'bg-gray-800 text-white'
  }
}
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-5 py-3 rounded-lg shadow-lg text-sm font-medium',
          getToastClasses(toast.type)
        ]"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>