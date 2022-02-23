<script setup>
const props = defineProps({
  social: Object
});
</script>

<template lang="pug">
.social 
  a.text-button(v-if="social.instagram", :href="'https://instagram.com/' + social.instagram", target="_blank")
    la-instagram.icon
    .name @{{ social.instagram }}
  a.text-button(v-if="social.telegram", :href="'https://t.me/' + social.telegram", target="_blank")
    la-telegram.icon
    .name {{ social.telegram }}
  a.text-button(v-if="social.github", :href="'https://github.com/' + social.github", target="_blank")
    la-github.icon
    .name {{ social.github }}
  a.text-button(v-if="social.email", :href="'mailto:' + social.email", target="_blank")
    la-at.icon
    .name {{ social.email }}
  a.text-button(v-if="social.reddit", :href="'https://www.reddit.com/' + social.reddit", target="_blank")
    la-reddit.icon
    .name {{ social.reddit }}
</template>

<style scoped>
.social {
  @apply flex flex-wrap px-2;
}

.social a {
  @apply flex items-center;
}

.social .icon {
  @apply text-3xl pr-2 py-1;
}

.social .name {
  @apply text-1rem;
}
</style>