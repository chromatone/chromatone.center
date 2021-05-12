<template lang="pug">
.flex.flex-wrap.mt-4(v-if="buttons && buttons.length > 0")
  a.button(v-for="link in buttons", :key="link.url", :href="link.url", target="_blank", :class="{ [link.type]: true }") 
    la-link(v-if="link?.type == 'primary'")
    la-github(v-if="link?.type == 'github'")
    span {{ link.text }}
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  buttons: Array
});
</script>

<style scoped>
.button {
  @apply flex items-center px-3 py-2 rounded-xl font-bold mr-2 my-2 shadow-md bg-gray-100 dark:bg-gray-800;
  & svg {
    @apply mr-1;
  }
  &.primary {
    @apply bg-orange-300 dark:bg-orange-700;
  }
  &.github {
    @apply bg-gray-200 dark:bg-gray-700;
  }
}
</style>