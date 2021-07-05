<template lang="pug">
.theme(:class="pageClasses")
  nav-bar(v-if="showNavbar", @toggle="toggleSidebar")
  .main
    side-bar(:open="openSideBar")
      .sidebar-mask(@click="toggleSidebar(false)")
    home(v-if="$frontmatter.template == 'home'")
    page(v-else)
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
  background-blend-mode: overlay;
  @apply min-h-screen bg-cover bg-center bg-fixed pt-$header-height;
}

@screen lg {
  .grid-layout-2 {
    display: grid;
    grid-template-columns: 16rem minmax(100px, 1fr);
    grid-template-rows: 1fr;
    gap: 0px 16px;
  }
}

/* @screen lg {
  .grid-layout {
    grid-template-columns: min-content minmax(100px, 2fr) 16rem;
  }
} */
</style>
