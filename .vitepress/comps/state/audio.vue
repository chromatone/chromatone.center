<script setup>
import { useAudio } from '@theme/composables/state'
import { onClickOutside } from '@vueuse/core'


const audio = useAudio()
const open = ref(false);

const panel = ref()

function toggle(ev) {
  open.value = !open.value
}

onClickOutside(panel, (ev) => {
  // if (open.value) ev.stopPropagation()
  open.value = false
})


</script>

<template lang="pug">
.btn.w-10
  button.p-2.text-2xl(
    @click.stop.prevent="open = true"
    aria-label="Toggle mute"
    )
    bi-volume-up(v-if="!audio.mute")
    bi-volume-mute(v-else)
  transition(name="panel")
    .p-2.z-100.absolute.mt-2.-ml-4.bg-light-400.dark_bg-dark-400.shadow-lg.rounded-xl(v-if="open" ref="panel")
      control-knob(
        param="Vol"
        v-model="audio.volume"
        :min="0"
        :max="1"
        :step="0.001"
      )
      button.text-button.border.mute.mt-24(
        @click="audio.mute = !audio.mute" 
        :class="{ active: !audio.mute }"
        aria-label="Toggle mute"
        )
        bi-volume-up(v-if="!audio.mute")
        bi-volume-mute(v-else)
</template>

<style  scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply absolute right-0 top-$header-height w-full p-4 bg-light-300 dark_bg-dark-300 z-20 flex bg-opacity-90 dark_bg-opacity-90 flex items-center shadow-lg;
}
</style>