<script setup>
import { useMidi } from '#/use/midi'
import { noteColor } from "#/use/colors"

const { midi, activeChromaMidi } = useMidi()
</script>

<template lang="pug">
.fixed.z-1800.bottom-0.flex.left-0.right-0.pointer-events-none.px-4.pb-1
  .flex-1.rounded-lg.h-2.transition-all.duration-100ms.ease-out.opacity-100(
    v-for="(active, pitch) in activeChromaMidi"  :key="pitch"
    :style="{ backgroundColor: active ? noteColor(active - 9 - 24) : '#eee2' }"
    )
 
</template>