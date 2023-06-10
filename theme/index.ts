
import { GesturePlugin } from "@vueuse/gesture";
import FloatingVue from 'floating-vue'

import VueAnimXyz from '@animxyz/vue3'
import '@animxyz/core'

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
  enhanceApp({ app }) {
    app.use(GesturePlugin);
    app.use(FloatingVue)
    app.use(VueAnimXyz)
  },
};

export default theme;
