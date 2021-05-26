import 'virtual:windi.css'
import { MotionPlugin } from '@vueuse/motion'
import { GesturePlugin } from '@vueuse/gesture'

import './styles/vars.css'
import './styles/transitions.css'
import './styles/layout.postcss'
import './styles/custom-blocks.css'
import './styles/sidebar-links.postcss'

import Layout from './layout.vue'
import NotFound from './not-found.vue'
import rowList from '@theme/components/row/list.vue'

const theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.use(MotionPlugin)
    app.use(GesturePlugin)
    app.component(rowList)

    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined'
    ) {
      window.owa_baseUrl = 'http://stats.frkt.ru/'
      window.owa_cmds = window.owa_cmds || []
      window.owa_cmds.push(['setSiteId', 'a77f19d1e45d3e4e89ac7a0287e52b77'])
      window.owa_cmds.push(['trackPageView'])
      window.owa_cmds.push(['trackClicks'])
      ;(function () {
        var _owa = document.createElement('script')
        _owa.type = 'text/javascript'
        _owa.async = true
        window.owa_baseUrl =
          'https:' == document.location.protocol
            ? window.owa_baseSecUrl ||
              window.owa_baseUrl.replace(/http:/, 'https:')
            : window.owa_baseUrl
        _owa.src =
          window.owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js'
        var _owa_s = document.getElementsByTagName('script')[0]
        _owa_s.parentNode.insertBefore(_owa, _owa_s)
      })()
    }
  },
}

export default theme
