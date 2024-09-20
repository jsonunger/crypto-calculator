<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
  }>();
</script>

<template>
  <label :for="id" class="w-full md:w-fit">
    <span class="text-md md:text-lg font-semibold block mb-2">{{ label }}</span>
    <slot />
  </label>
</template>

<style scoped></style>
