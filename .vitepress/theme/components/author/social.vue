<script setup>
const props = defineProps({
  social: Object
});
</script>

<template lang="pug">
.social 
  a(v-if="social.instagram", :href="'https://instagram.com/' + social.instagram", target="_blank")
    .i-la-instagram.icon
    .name @{{ social.instagram }}
  a(v-if="social.telegram", :href="'https://t.me/' + social.telegram", target="_blank")
    .i-la-telegram.icon
    .name {{ social.telegram }}
  a(v-if="social.github", :href="'https://github.com/' + social.github", target="_blank")
    .i-la-github.icon
    .name {{ social.github }}
  a(v-if="social.email", :href="'mailto:' + social.email", target="_blank")
    .i-la-at.icon
    .name {{ social.email }}
  a(v-if="social.reddit", :href="'https://www.reddit.com/' + social.reddit", target="_blank")
    .i-la-reddit.icon
    .name {{ social.reddit }}
</template>

<style lang="postcss" scoped>
.social {
  @apply flex flex-wrap px-2 items-center;
}

.social a {
  @apply flex items-center p-2;
}

.social .icon {
  @apply text-3xl pr-2 py-1;
}

.social .name {
  @apply text-1rem;
}
</style>