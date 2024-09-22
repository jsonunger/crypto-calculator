<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { blue } from 'tailwindcss/colors';
  import { ChevronRightIcon } from '@heroicons/vue/24/solid';
  // @ts-expect-error: No type declaration files for this library
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
  import type { FactoryOpts } from 'imask';
  import MaskedInput from './MaskedInput.vue';

  const { btcExchangeRate, ethExchangeRate } = defineProps<{
    loading: boolean;
    btcExchangeRate: number | undefined;
    ethExchangeRate: number | undefined;
  }>();

  const usd = ref<number | undefined>();

  const usdMask: FactoryOpts = {
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
      },
    },
  };

  const cryptoMask: FactoryOpts = {
    mask: Number,
    min: 0,
    normalizeZeros: false,
    radix: '.',
    scale: 10,
    thousandsSeparator: ',',
  };

  // These values are calculated based on the exchange rates and the dollar amount
  // in the input, so we can just compute them.
  const btc = computed(() => {
    if (usd.value && btcExchangeRate) {
      return usd.value * 0.7 * btcExchangeRate;
    }
    return undefined;
  });
  const eth = computed(() => {
    if (usd.value && ethExchangeRate) {
      return usd.value * 0.3 * ethExchangeRate;
    }
    return undefined;
  });

  // We can just focus on updating the ref when the usd input is changed since the crypto values are computed
  function setValues(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      usd.value = +value.replace(/[^\d.]/g, '');
    } else {
      usd.value = undefined;
    }
  }
</script>

<template>
  <div
    class="grid items-center inputs-wrapper gap-x-4 gap-y-8 md:gap-y-16 justify-items-center md:justify-items-start"
  >
    <!-- While we're loading the exchange rates, we'll still show the inputs, they'll just be disabled and we'll show the loading indicator instead of the chevron -->
    <MaskedInput
      id="usd"
      label="Investable assets"
      :input-value="usd"
      class="usd"
      :disabled="loading"
      :mask-options="usdMask"
      @input-change="setValues"
    />
    <ClipLoader
      v-if="loading"
      :color="blue[500]"
      size="41px"
      class="arrow justify-self-center"
    />
    <ChevronRightIcon
      v-else
      class="arrow h-12 justify-self-center self-center"
    />
    <MaskedInput
      id="btc"
      label="70% BTC allocation"
      :input-value="btc"
      disabled
      class="btc md:justify-self-end mb-8"
      :mask-options="cryptoMask"
    />
    <MaskedInput
      id="eth"
      label="30% ETH allocation"
      :input-value="eth"
      disabled
      class="eth md:justify-self-end"
      :mask-options="cryptoMask"
    />
  </div>
</template>

<style scoped>
  .inputs-wrapper {
    grid-template:
      'u'
      'a'
      'b'
      'e';
  }

  .usd {
    grid-area: u;
  }

  .arrow {
    grid-area: a;
    transform: rotate(90deg);
  }

  .btc {
    grid-area: b;
  }

  .eth {
    grid-area: e;
  }

  @media screen(md) {
    .inputs-wrapper {
      grid-template:
        'u a b'
        'u a e';
    }

    .arrow {
      transform: unset;
    }
  }
</style>
