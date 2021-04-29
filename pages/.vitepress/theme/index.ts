import 'virtual:windi.css'
import { MotionPlugin } from '@vueuse/motion'

import './styles/vars.css'
import './styles/layout.postcss'
import './styles/custom-blocks.css'
import './styles/sidebar-links.postcss'

import { Theme } from 'vitepress'
//@ts-ignore
import Layout from './layout.vue'
//@ts-ignore
import NotFound from './not-found.vue'
import rowList from '@components/row/list.vue'


const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.use(MotionPlugin)
    //@ts-ignore
    app.component(rowList)
  },
}

export default theme
