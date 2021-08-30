<template lang="pug">
.flex.flex-wrap.mt-4(v-if="buttons && buttons.length > 0")
  a.button(v-for="link in buttons", :key="link.url", :href="link.url", target="_blank", :style="{ backgroundColor: color }") 
    la-link(v-if="link?.type == 'primary'")
    la-github(v-if="link?.type == 'github'")
    la-instagram(v-if="link?.type == 'instagram'")
    la-heart(v-if="link?.type == 'heart'")
    span {{ link.text }}
</template>

<script setup>
const props = defineProps({
  buttons: Array,
  color: {
    type: String,
    default: '#555'
  }
});
</script>

<style scoped>
.button {
  @apply flex items-center px-3 py-2 rounded-md font-bold mr-2 my-2 shadow-md bg-gray-100 dark:bg-gray-800;
  & svg {
    @apply mr-1;
  }
}
</style>