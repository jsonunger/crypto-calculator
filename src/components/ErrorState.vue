<script setup lang="ts">
  defineProps<{ fetchExchangeRates(): void }>();
</script>
<template>
  <h2 class="text-xl font-medium mb-8">
    Unable to fetch exchange rates. Please try again.
  </h2>
  <button
    type="button"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
    @click="fetchExchangeRates"
  >
    Refetch
  </button>
</template>
