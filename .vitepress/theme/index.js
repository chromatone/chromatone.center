import 'virtual:windi.css'
import { MotionPlugin } from '@vueuse/motion'

import './styles/vars.css'
import './styles/layout.postcss'
import './styles/custom-blocks.css'
import './styles/sidebar-links.postcss'

import Layout from './layout.vue'
import NotFound from './not-found.vue'
import rowList from '@components/row/list.vue'

const theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.use(MotionPlugin)
    //@ts-ignore
    app.component(rowList)
  },
}

export default theme
