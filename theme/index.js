/// <reference types="vite/client" />

import { GesturePlugin } from "@vueuse/gesture";
import FloatingVue from 'floating-vue'

import Layout from "./layout.vue";
import NotFound from "./not-found.vue";

import '@unocss/reset/tailwind.css'
import 'uno.css'
import "./styles/vars.css";
import "./styles/transitions.css";
import "./styles/layout.postcss";
import "./styles/custom-blocks.css";
import 'floating-vue/dist/style.css'


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
