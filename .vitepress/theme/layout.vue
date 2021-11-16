<template lang="pug">
.theme(:class="pageClasses")
  nav-bar(v-if="showNavbar", @toggle="toggleSidebar")
  .main

    transition(name="fade")
      .sidebar-mask.z-5(v-show="openSideBar", @click="toggleSidebar(false)")
    side-bar(:open="openSideBar")
    home(v-if="$frontmatter.template == 'home'")
    page-main(v-else)
//debug
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  useRoute,
  useData,
} from 'vitepress'
import { isSideBarEmpty, getSideBarConfig } from './support/sideBar.js'

// generic state
const route = useRoute()
const siteData = useData()

const enableHome = computed(() => !!route?.data?.frontmatter?.home)

// navbar
const showNavbar = computed(() => {
  const { theme } = siteData
  if (!route.data) return true
  const { frontmatter } = route.data
  if (frontmatter.navbar === false || theme.value.navbar === false)
    return false

  return (
    siteData.title.value
    || theme.value.logo
    || theme.value.repo
    || theme.value.nav
  )
})

// sidebar
const openSideBar = ref(false)

const showSidebar = computed(() => {
  if (!route.data) return true
  const { frontmatter } = route.data

  if (frontmatter.home || frontmatter.sidebar === false)
    return false

  const { theme } = siteData

  return !isSideBarEmpty(
    getSideBarConfig(theme.value.sidebar, route.data.relativePath),
  )
})

const toggleSidebar = (to) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}

const hideSidebar = toggleSidebar.bind(null, false)
// close the sidebar when navigating to a different location
watch(route, hideSidebar)
// TODO: route only changes when the pathname changes
// listening to hashchange does nothing because it's prevented in router

// page classes
const pageClasses = computed(() => {
  return [
    {
      'no-navbar': !showNavbar.value,
      'sidebar-open': openSideBar.value,
      'no-sidebar': !showSidebar.value,
    },
  ]
});
</script>

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
