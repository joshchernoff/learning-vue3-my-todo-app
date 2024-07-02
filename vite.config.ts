import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/learning-vue3-my-todo-app/', // replace with your repository name
  plugins: [vue()],
});
