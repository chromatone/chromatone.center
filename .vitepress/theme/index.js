import "virtual:windi.css";
import { GesturePlugin } from "@vueuse/gesture";
import FloatingVue from 'floating-vue'

import "./styles/vars.css";
import "./styles/transitions.css";
import "./styles/layout.postcss";
import "./styles/custom-blocks.css";
import 'floating-vue/dist/style.css'


import Layout from "./layout.vue";
import NotFound from "./not-found.vue";

const theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.use(GesturePlugin);
    app.use(FloatingVue)
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined"
    ) {
      window.owa_baseUrl = "http://stats.frkt.ru/";
      window.owa_cmds = window.owa_cmds || [];
      window.owa_cmds.push(["setSiteId", "8f6d414728cf30c94bfb21602828b0d1"]);
      window.owa_cmds.push(["trackPageView"]);
      window.owa_cmds.push(["trackClicks"]);
      (function () {
        var _owa = document.createElement("script");
        _owa.type = "text/javascript";
        _owa.async = true;
        window.owa_baseUrl =
          "https:" == document.location.protocol
            ? window.owa_baseSecUrl ||
            window.owa_baseUrl.replace(/http:/, "https:")
            : window.owa_baseUrl;
        _owa.src =
          window.owa_baseUrl + "modules/base/js/owa.tracker-combined-min.js";
        var _owa_s = document.getElementsByTagName("script")[0];
        _owa_s.parentNode.insertBefore(_owa, _owa_s);
      })();
    }
  },
};

export default theme;
