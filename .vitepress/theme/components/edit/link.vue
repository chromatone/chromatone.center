<template lang="pug">
.edit-link
  a.link(v-if="url" :href="url" target="_blank" rel="noopener noreferrer")
    | {{ text }}
    carbon:launch(class="inline-block ml-1.5 text-xs leading-6 opacity-50")
</template>

<script setup lang="ts">
import { useEditLink } from '../../composables/editLink'

const { url, text } = useEditLink()
</script>

<style scoped >
.link {
  @apply text-base font-medium
    text-$c-text-light
    hover:(no-underline text-$c-brand);
}
</style>
