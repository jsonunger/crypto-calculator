<script setup lang="ts">
  import { useIMask } from 'vue-imask';
  import BaseInput from './BaseInput.vue';
  import { watch } from 'vue';

  const { inputValue } = defineProps<{
    id: string;
    label: string;
    inputValue: number | undefined;
  }>();

  const { el, typed, masked } = useIMask({
    mask: Number,
    min: 0,
    normalizeZeros: false,
    radix: '.',
    scale: 10,
    thousandsSeparator: ',',
    value: inputValue ?? '',
  });

  watch(
    () => inputValue,
    (newInputValue) => {
      if (newInputValue) {
        typed.value = newInputValue;
      } else {
        masked.value = '';
      }
    },
  );
</script>

<template>
  <BaseInput :id :label>
    <input
      :id
      ref="el"
      class="rounded bg-gray-100 w-full cursor-not-allowed"
      disabled
    />
  </BaseInput>
</template>

<style scoped></style>
