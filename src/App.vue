<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ErrorState from './components/ErrorState.vue';
  import InputsBlock from './components/InputsBlock.vue';

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
</script>

<template>
  <h1 class="text-3xl md:text-5xl text-pretty font-bold mb-12">
    Asset allocation calculator
  </h1>
  <ErrorState
    v-if="!loading && (!btcExchangeRate || !ethExchangeRate)"
    :fetch-exchange-rates
  />
  <InputsBlock v-else :loading :btc-exchange-rate :eth-exchange-rate />
</template>
