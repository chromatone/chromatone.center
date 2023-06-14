/// <reference types="vite/client" />


import { GesturePlugin } from "@vueuse/gesture";
import FloatingVue from 'floating-vue'

import VueAnimXyz from '@animxyz/vue3'
import '@animxyz/core'

import Layout from "./layout.vue";
import NotFound from "./not-found.vue";

const theme = {
  Layout,
  NotFound,
  //@ts-expect-error
  async enhanceApp({ app }) {

    app.use(FloatingVue)
    app.use(GesturePlugin);

    if (!import.meta.env.SSR) {
      //@ts-expect-error
      const glsl = await import('vue-glsl')
      app.use(glsl.default);
    }
  },
};

export default theme;
