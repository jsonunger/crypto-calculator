import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-expect-error: No declaration file for this npm module
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslint()],
});
