<template lang="pug">
ul.sidebar-links(v-if="items.length > 0")
  side-link(v-for="item of items" :key="item.text" :item="item")
</template>

<script setup lang="ts">
import { useSideBar } from '../../composables/sideBar'

const items = useSideBar()
</script>

