<script setup lang="ts">
  import { useIMask } from 'vue-imask';
  import BaseInput from './BaseInput.vue';

  const { inputValue } = defineProps<{
    id: string;
    label: string;
    inputValue: number | undefined;
    disabled?: boolean;
  }>();
  defineEmits<{
    'input-change': [event: Event];
  }>();

  const { el } = useIMask({
    mask: '$ money',
    lazy: false,
    blocks: {
      money: {
        mask: Number,
        min: 0,
        normalizeZeros: false,
        radix: '.',
        scale: 2,
        thousandsSeparator: ',',
        value: inputValue ?? '',
      },
    },
  });
</script>

<template>
  <BaseInput :id :label>
    <input
      :id
      ref="el"
      class="rounded w-full"
      :class="{ 'bg-gray-100': disabled, 'cursor-not-allowed': disabled }"
      :disabled
      @change="$emit('input-change', $event)"
    />
  </BaseInput>
</template>

<style scoped></style>
