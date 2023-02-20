
import { GesturePlugin } from "@vueuse/gesture";
import FloatingVue from 'floating-vue'

import VueAnimXyz from '@animxyz/vue3'
import '@animxyz/core'

import Layout from "./layout.vue";
import NotFound from "./not-found.vue";

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
