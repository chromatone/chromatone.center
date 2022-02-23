<script setup>
import { mute } from '@use/synth'
import { getDestination, gainToDb } from 'tone'
const open = ref(false);
const volume = useClamp(useStorage('main-vol', 1), 0, 1);
import { onClickOutside } from '@vueuse/core'

const panel = ref()

function toggle(ev) {
  open.value = !open.value
}

onClickOutside(panel, (ev) => {
  if (open.value) ev.stopPropagation()
  open.value = false
})

function dragVol(drag) {
  volume.value -= drag.delta[1] / 300
  getDestination().volume.targetRampTo(gainToDb(volume.value), 0.1)
}
</script>

<template lang="pug">
.btn.relative.w-10
  button.absolute.mute.p-2(@click.stop.prevent="open = true" aria-label="Toggle mute")
    bi-volume-up(v-if="!mute")
    bi-volume-mute(v-else)
  transition(name="panel")
    .absolute.w-10.h-32.rounded-full.has-bg.flex.flex-col.items-center.shadow-lg.cursor-pointer.z-20(
      style="touch-action:none;"
      ref="panel"
      v-if="open" 
      v-drag="dragVol"
      )
      .p-1.rounded-xl.opacity-50.bg-current.absolute.top-4.bottom-12
      .p-10px.rounded-full.bg-current.absolute.cursor-pointer(
        :style="{ transform: `translateY(${70 - volume * 60}px)` }"
      )
      button.mute.mt-24(@click="mute = !mute" aria-label="Toggle mute")
        bi-volume-up(v-if="mute")
        bi-volume-mute(v-else)

</template>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>