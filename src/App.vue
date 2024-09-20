<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { ChevronRightIcon } from '@heroicons/vue/24/solid';
  // @ts-expect-error: No type declaration files for this library
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
  import { blue } from 'tailwindcss/colors';
  import DollarInput from './components/DollarInput.vue';
  import CryptoInput from './components/CryptoInput.vue';
  import ErrorState from './components/ErrorState.vue';

  const API_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=USD';
  interface ExchangeRateResponse {
    data: {
      currency: string;
      rates: Record<string, `${number}`>;
    };
  }

  const loading = ref(true);
  const btcExchangeRate = ref<number | undefined>();
  const ethExchangeRate = ref<number | undefined>();

  async function fetchExchangeRates() {
    try {
      loading.value = true;
      const res = await fetch(API_URL);
      const resJSON = (await res.json()) as ExchangeRateResponse;

      const rates = resJSON.data?.rates ?? {};

      btcExchangeRate.value = +rates.BTC;
      ethExchangeRate.value = +rates.ETH;
    } catch (e) {
      // Would want to capture this in a way that can be observed in a real scenario
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  // Good to initialize on mount if we ever implemented SSR
  onMounted(fetchExchangeRates);

  const usd = ref<number | undefined>();

  // These values are calculated based on the exchange rates and the dollar amount
  // in the input, so we can just compute them.
  const btc = computed(() => {
    if (usd.value && btcExchangeRate.value) {
      return usd.value * 0.7 * btcExchangeRate.value;
    }
    return undefined;
  });
  const eth = computed(() => {
    if (usd.value && ethExchangeRate.value) {
      return usd.value * 0.3 * ethExchangeRate.value;
    }
    return undefined;
  });

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
  <h1 class="text-3xl md:text-5xl text-pretty font-bold mb-12">
    Asset allocation calculator
  </h1>
  <ErrorState
    v-if="!loading && (!btcExchangeRate || !ethExchangeRate)"
    :fetch-exchange-rates
  />
  <div
    v-else
    class="grid items-center inputs-wrapper gap-x-4 gap-y-8 md:gap-y-16 justify-items-center md:justify-items-start"
  >
    <!-- While we're loading the exchange rates, we'll still show the inputs, they'll just be disabled and we'll show the loading indicator instead of the chevron -->
    <DollarInput
      id="usd"
      label="Investable assets"
      :input-value="usd"
      class="usd"
      :disabled="loading"
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
    <CryptoInput
      id="btc"
      label="70% BTC allocation"
      :input-value="btc"
      class="btc md:justify-self-end mb-8"
    />
    <CryptoInput
      id="eth"
      label="30% ETH allocation"
      :input-value="eth"
      class="eth md:justify-self-end"
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
