<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center sm:px-6">
    <section
      class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12"
      aria-labelledby="not-found-title"
    >
      <p class="text-sm font-semibold uppercase tracking-widest text-primary-700">Error 404</p>
      <h1 id="not-found-title" class="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        Página no encontrada
      </h1>
      <p class="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-500 sm:text-base">
        La dirección que visitaste no existe o pudo haber cambiado. Puedes volver al inicio y
        continuar desde allí.
      </p>
      <RouterLink
        to="/"
        class="mt-8 inline-flex items-center justify-center rounded-lg bg-primary-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
      >
        Volver al inicio
      </RouterLink>
    </section>
  </main>
</template>
