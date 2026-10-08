<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()

const spinnerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (spinnerRef.value) {
    gsap.to(spinnerRef.value, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })
  }
})

const sizeClasses: Record<string, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
}
</script>

<template>
  <div
    ref="spinnerRef"
    :class="['rounded-full border-primary-300 border-t-primary-700', sizeClasses[size || 'md']]"
  />
</template>
