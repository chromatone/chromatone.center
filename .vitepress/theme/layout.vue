<script setup>
import {
  useRoute,
  useData,
} from 'vitepress'

// generic state
const route = useRoute()

// sidebar
const openSideBar = ref(false)

watch(route, () => {
  openSideBar.value = false
})

</script>

<template lang="pug">
.theme
  nav-bar(@toggle="openSideBar = !openSideBar")
  .main
    transition(name="fade")
      .sidebar-mask.z-5(v-show="openSideBar", @click="openSideBar = false")
    side-bar(:open="openSideBar")
    home(v-if="$frontmatter.template == 'home'")
    page-main(v-else)
//debug
</template>

<style >
.main {
  @apply relative flex min-h-screen bg-cover bg-center bg-fixed;
}

.sidebar-mask {
  transition: all 300ms ease-out;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  @apply bg-gray-800 bg-opacity-60;
}
</style>
