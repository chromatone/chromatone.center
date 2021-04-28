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


import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
//@ts-ignore
TimeAgo.addDefaultLocale(en)


const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.use(MotionPlugin)
  },
}

export default theme
