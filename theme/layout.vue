<script setup>
import { computed } from 'vue';
import { useRoute, useData } from "vitepress";
import { lchToHsl } from '#/use/colors'
import { data } from '../content/pages.data'
import { cleanLink, usePages, usePage } from '../pages/index'
import { drawingEnabled, drawingPinned } from '../theme/composables/draw'

const { isDark, theme } = useData()

import { ref, watch } from "vue";

const route = useRoute();

const { frontmatter: f } = useData()

const openSideBar = ref(false);

const { pages, children, siblings, parents } = usePages(route, data)
const page = usePage(route, data)


const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 40, 60));
</script>

<template lang="pug">
.theme
  img.top-16px.left-4.fixed.z-1000.cursor-pointer.mr-3.h-30px(v-if="theme.logo", :src="theme.logo", alt="Chromatone logo" @click="openSideBar = !openSideBar")
  client-only
    nav-tools
  nav-view
  .main
    side-bar(:open="openSideBar" @close="openSideBar = false")

    template(v-if="f.template == 'home'")
      main.home.items-center(aria-labelledby="main-title")
        chroma-flower.mt-16.w-full
        .p-8.gap-1.flex.flex-col.items-center.text-center
          .text-4rem.font-bold Chromatone
          .text-2rem Visual Music Language
          .text-xl to learn, explore and express with 
        .flex.flex-col.max-w-60ch.ml-2
          home-tile(
            v-for="(area, i) in children", 
            :key="area.url", 
            :item="area", 
            :i="i",
            :total="children.length")  
          youtube-embed(:video="f?.youtube" v-if="f?.youtube")
        content.content.z-2

    template(v-else)
      main#content.w-full.relative
        page-headline(
          v-if="f.layout!='app'"
          :pageColor="pageColor", :lightColor="lightColor" :page="f" :cover="f.dynamic ? f?.cover || f?.poster || '' : page?.frontmatter?.cover ")

          page-parents.mb-1.ml-6(:parents="f.dynamic ? parents : parents.slice(0,-1)")
        .z-100.text-md.p-2.flex.flex-wrap.gap-2.items-center.bg-light-200.bg-opacity-60.dark-bg-dark-200.dark-bg-opacity-60.backdrop-blur-xl.pt-2.pl-14.lg-pl-8.min-h-15(
          :style="{backgroundColor:pageColor}"
          v-else)
          h2.font-bold {{ f?.title }}
          .p-0 {{ f?.description }}
        iframe.min-h-80svh.w-full.max-w-100svw(
          v-if="f?.iframe"
          :src="f.iframe"
          )
        transition(name="fade")
          .pb-8.relative.flex.flex-col.items-stretch.w-full(:key="route.path")

            content.content.flex-auto.z-10(v-if="f?.topContent")

            row-list.px-2.my-2.max-w-200( :children="children")

            content.content.flex-auto.z-10(v-if="!f?.topContent")

        nav-next-prev(:siblings="siblings" :parents="parents")
        nav-row.p-4
    client-only
      draw-layer.z-100
      cast-camera
      draw-controls.fixed.bottom-4.left-4.right-16.z-100(v-if="drawingEnabled || drawingPinned")
//debug
</template>

<style lang="postcss">
.main {
  @apply relative flex items-stretch min-h-screen bg-cover bg-center bg-fixed;
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
  @apply w-full relative pb-16 flex flex-col bg-light-500 dark-(bg-dark-500) transition-all duration-600 ease-out;
}

.noise {
  @apply w-full h-full absolute pointer-events-none z-0;
  background: linear-gradient(to top, hsla(0, 0%, 50%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}
</style>
<!-- 
.i-mdi-checkbox-blank-circle-outline .i-mdi-checkbox-blank-circle -->
