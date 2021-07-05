<template lang="pug">
ul.sidebar-links(v-if="items.length > 0")
  side-link(v-for="item of items" :key="item.text" :item="item")
</template>

<script setup>
import { useSideBar } from '../../composables/sideBar.js'
import sideLink from './link.js'

const items = useSideBar();
</script>

