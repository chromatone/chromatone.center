<script setup>
import { computed } from 'vue';
import { isDark } from '#/theme/composables/state'
import { useRoute, useData } from "vitepress";
import { lchToHsl } from '#/use/colors'
import { data } from '../content/pages.data.js'
import { cleanLink, usePages, usePage } from 'vitepress-pages'
import { drawingEnabled, drawingPinned } from '../theme/components/draw/draw'

import { ref, watch } from "vue";

const route = useRoute();

const { frontmatter } = useData()

const openSideBar = ref(false);

const { pages, children, siblings, parents } = usePages(route, data)
const page = usePage(route, data)


const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 70, 60));
</script>

<template lang="pug">
.theme
  nav-bar(@toggle="openSideBar = !openSideBar")
  nav-view
  .main
    side-bar(:open="openSideBar" @close="openSideBar = false")

    template(v-if="frontmatter.template == 'home'")
      main.home(aria-labelledby="main-title")
        .noise
        content.content.z-2
        .flex.flex-col.max-w-60ch.ml-2
          home-tile(
            v-for="(area, i) in children", 
            :key="area.url", 
            :item="area", 
            :i="i",
            :total="children.length",
            )  

    template(v-else)
      main#content.w-full
        page-headline(:pageColor="pageColor", :lightColor="lightColor" :page="page")
          page-parents.text-xl.mb-4(:parents="parents.slice(0,-1)")

        transition(name="fade")
          .content-container(:key="route.path")
            row-list.my-2.max-w-full(v-if="!frontmatter.value?.topContent" :children="children")

            content.content.flex-auto.z-10

            shop-message(:page="page", :siblings="siblings")

            row-list.my-2.max-w-full(v-if="frontmatter.value?.topContent" :children="children")

        nav-next-prev(:siblings="siblings" :parents="parents")
        page-footer

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
