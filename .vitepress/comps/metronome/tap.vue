<template lang="pug">
.flex(
  :style="{ opacity: tempo.tap.last ? 1 : 0.5 }"
  @mousedown.stop.prevent="tap()",
  @touchstart.stop.prevent="tap()"
)
  fluent-tap-double-20-regular

</template>

<script setup>
import { tempo, tap } from '@use/tempo.js'


</script>

<style scoped>
</style>