<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterView, useRoute } from 'vue-router'
  import AppNavbar from '@/components/layout/AppNavbar.vue'
  import AppToast from '@/components/layout/AppToast.vue'

  const route = useRoute()

  const showNavBar = computed(() => {
    const publicRoutes = ['login', 'register', 'landing']
    return !publicRoutes.includes(route.name as string)
  })
  
</script>

<template>
  <AppNavbar v-if="showNavBar" />
  <RouterView />
  <AppToast />
</template>

<style scoped></style>
