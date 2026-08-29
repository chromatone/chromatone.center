<script setup>
import { computed } from 'vue';
import { useRoute, useData } from "vitepress";
import { lchToHsl } from '#/use/colors'
import { data } from '../content/pages.data'
import { usePages, usePage, cleanLink } from './pages'
import { drawingEnabled, drawingPinned } from '../theme/composables/draw'
import { useUrlSearchParams } from '@vueuse/core'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const params = useUrlSearchParams('history')
const { isDark, theme } = useData()
const route = useRoute();
const { frontmatter: f } = useData()

const { pages, children, siblings, parents } = usePages(route, data)

const page = usePage(route, data)

const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 40, 60));

function scrollTop() { y.value = 0 }

function close() {
  if (window.opener) {
    window.close();
    window.opener.focus();
  }
}

</script>

<template lang="pug">
a.top-16px.left-2.fixed.z-1000.cursor-pointer.mr-3.op-40.hover-op-100.transition(href="/" @click="close()")
  img.h-30px(src="https://chromatone.center/media/logo/smooth.svg", alt="Chromatone logo")

full-screen.op-40.hover-op-80.active-op-100.transition.text-xl.fixed.bottom-2.right-2.z-10000(v-if="params?.pure")

bar-bar(v-if="!params.pure && !params.nobar")

midi-notes(v-if="!params.pure && !params.nokeys")

.main(:style="{ marginLeft: params?.pure ? 0 : '48px' }" :class="{ pure: params.pure }")

  RegisterSW

  template(v-if="f.layout == 'iframe'")
    iframe.min-h-100dvh.w-full.max-w-100dvw(
      v-if="f?.iframe"
      :src="f.iframe"
      allow="midi;microphone;fullscreen;"
      )

  .w-full.h-full(v-else-if="f.layout == 'app'")
    content

  template(v-else-if="f.layout == 'home'")

    main.p-4(aria-labelledby="main-title")
      chroma-flower.flex.justify-center(style="flex: 1 1 420px")
      .flex-1.p-2.gap-1.flex.flex-col.text-center(style="flex: 1 1 420px")
        .text-3rem.md-text-4rem.font-bold Chromatone
        .text-2xl.md-ml-1 Visual Music Language
        .text-lg.md-ml-1 to learn, explore and communicate with 
      .flex.flex-col.items-center.p-4.gap-8
        .flex.flex-wrap.gap-8.items-stretch 
          home-tile.rounded-2xl(
            style="flex: 1 1 420px;"
            v-for="(area, i) in children", 
            :key="area.url", 
            :item="area", 
            :i="i",
            :total="children.length")  
          .flex.flex-col.gap-4(style="flex: 1 1 420px;")
            youtube-embed(:video="f?.youtube" v-if="f?.youtube")
      content#content
      //- page-footer(v-if="!params.pure && !params.nofooter")
  template(v-else)
    transition(name="fade")
      main#content(:key="route.path")
        transition(name="panel" mode="in-out")
          page-headline(
            v-if="f.layout != 'app'"
            :pageColor="pageColor", :lightColor="lightColor" :page="f" :cover="f.dynamic ? f?.cover?.id || f?.poster?.id : page?.frontmatter?.cover") 
        transition(name="fade")
          .fixed.top-0.left-14.right-2.z-100.text-md.p-2.flex.gap-2.items-center.bg-light-200.bg-opacity-20.dark-bg-dark-200.dark-bg-opacity-10.backdrop-blur-lg.pt-2.pl-4.min-h-15.border-t-4.op-90.transition.rounded-xl(
            :style="{ borderColor: pageColor }"
            v-if="y > 100")
            .flex-1.flex.flex-wrap.gap-2
              h2.font-bold.select-none.pointer-events-none {{ f?.title }} 
              .p-0.select-none.pointer-events-none {{ f?.description }}

            .i-la-angle-up.w-6(@click="scrollTop()")

        iframe.min-h-80svh.w-full.max-w-100svw(
          allow="midi;microphone;fullscreen;"
          v-if="f?.iframe"
          :src="f.iframe"
          )

        content
        .flex.flex-wrap.gap-2
          row-list(:children="children")
        nav-next-prev(
          :siblings="siblings" 
          :parents="parents"
          v-if="!params.pure && !params.nonav && f.layout != 'app'"
          )

  client-only
    draw-layer.z-100
    cast-camera
    draw-controls.fixed.bottom-4.left-4.right-16.z-100(v-if="drawingEnabled || drawingPinned")
    
</template>

<style lang="postcss">
html,
body {
  overscroll-behavior: none;
}

#app {
  max-height: 99dvh;
}

.main {
  @apply relative flex items-stretch bg-cover bg-center bg-fixed;
}

#content {
  min-height: 0;
  width: 100%;
  padding: 2em;
  max-height: 100dvh;
  column-width: 36ch;
  column-gap: 2rem;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-padding: 2rem;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  z-index: 200;
}

#content p {
  padding: 0.5rem 0em;
  z-index: 100;
}

#content * {
  scroll-snap-align: start;
  z-index: 400;
}

#content img,
#content .iframe-container {
  break-inside: avoid;
}

#content * {
  line-height: 1.6;
}


.sidebar-mask {
  transition: all 300ms ease-out;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  @apply bg-gray-800 bg-opacity-60;
}

.home {
  @apply w-full relative flex flex-wrap gap-8 bg-light-500 dark-(bg-dark-500) transition-all duration-600 ease-out;
}

.noise {
  @apply w-full h-full absolute pointer-events-none z-0;
  background: linear-gradient(to top, hsla(0, 0%, 50%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}

.content .info {
  @apply m-2 bg-light-400 dark-bg-dark-400 z-10 max-w-55ch rounded-xl bg-op-80 dark-bg-op-80 backdrop-blur-md;
}

.pure #content {
  max-height: 100vh;
  overflow-y: scroll;
  overscroll-behavior: none;
}

.pure .content .info {
  @apply hidden;
}
</style>
<!-- 
.i-mdi-checkbox-blank-circle-outline .i-mdi-checkbox-blank-circle -->
