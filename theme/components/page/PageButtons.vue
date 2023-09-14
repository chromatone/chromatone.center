<script setup>
const props = defineProps({
  buttons: Array,
  color: {
    type: String,
    default: ''
  }
});
</script>

<template lang="pug">
.flex.flex-wrap.mt-4(v-if="buttons && buttons.length > 0")
  a.button(v-for="link in buttons", :key="link.url", :href="link.url", target="_blank", :style="{ backgroundColor: color }") 
    .i-la-link(v-if="link?.type == 'primary'")
    .i-la-github(v-if="link?.type == 'github'")
    .i-la-instagram(v-if="link?.type == 'instagram'")
    .i-la-heart(v-if="link?.type == 'heart'")
    .i-la-discord(v-if="link?.type == 'discord'")
    .i-la-reddit(v-if="link?.type == 'reddit'")
    span {{ link.text }}
</template>

<style lang="postcss" scoped>
.button {
  @apply flex items-center gap-2 p-4 text-lg rounded-md font-bold mr-2 my-2 shadow-md bg-gray-300 dark-bg-gray-800 no-underline;
}

.button svg {
  @apply mr-1;
}
</style>