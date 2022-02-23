<script setup>
defineEmits(['toggle']);
</script>

<template lang="pug">
header.nav-bar
  nav-bar-title

  div(class="hidden lg_flex px-3 ml-4 lg_ml-10")
    nav-links
  .flex-grow
  state-midi
  client-only
    state-synth
  state-mute
  state-dark
  nav-toggle-sidebar(@toggle="$emit('toggle')")
</template>

<style scoped>
.nav-bar {
  @apply lg_(sticky top-0) inset-x-0 z-40
    flex space-between align-center select-none
    border-b-1px border-$c-divider
    py-0.7rem px-4 z-40
    h-$header-height bg-$c-bg
    md_px-5 lg_px-6;
}

.nav-bar.root {
  @apply border-transparent bg-$c-bg-semi;
}
</style>
