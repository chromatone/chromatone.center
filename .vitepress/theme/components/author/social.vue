<template lang="pug">
.social 
  a(v-if="social.instagram", :href="'https://instagram.com/' + social.instagram", target="_blank")
    la-instagram.icon
    .name {{ social.instagram }}
  a(v-if="social.telegram", :href="'https://t.me/' + social.telegram", target="_blank")
    la-telegram.icon
    .name {{ social.telegram }}
  a(v-if="social.github", :href="'https://github.com/' + social.github", target="_blank")
    la-github.icon
    .name {{ social.github }}
  a(v-if="social.email", :href="'mailto:' + social.email", target="_blank")
    la-at.icon
    .name {{ social.email }}
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  social: Object
});
</script>

<style scoped>
.social {
  @apply flex flex-wrap px-2;
}

.social a {
  @apply flex items-center py-1 px-2 border m-1 rounded-xl shadow-md;
}

.social .icon {
  @apply text-3xl pr-2 py-1;
}

.social .name {
  @apply text-1rem;
}
</style>