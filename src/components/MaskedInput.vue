<script setup lang="ts">
  import { useIMask } from 'vue-imask';
  import type { FactoryOpts } from 'imask';
  import InputWrapper from './InputWrapper.vue';
  import { watch } from 'vue';

  const { inputValue, maskOptions } = defineProps<{
    id: string;
    label: string;
    inputValue: number | undefined;
    disabled?: boolean;
    maskOptions: FactoryOpts;
  }>();
  defineEmits<{
    'input-change': [event: Event];
  }>();

  const { el, typed, masked } = useIMask(maskOptions);

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
  <InputWrapper :id :label>
    <input
      :id
      ref="el"
      class="rounded w-full"
      :class="{ 'bg-gray-100': disabled, 'cursor-not-allowed': disabled }"
      :disabled
      @change="$emit('input-change', $event)"
    />
  </InputWrapper>
</template>

<style scoped></style>
