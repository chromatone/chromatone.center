<template lang="pug">
.btn
  button.mute.p-2(@click="open = !open" aria-label="Toggle mute")
    bi-volume-up(v-if="!mute")
    bi-volume-mute(v-else)
  transition(name="panel")
    .absolute.w-10.h-32.rounded-full.has-bg.flex.flex-col.items-center.shadow-lg.cursor-pointer(
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

<script setup>
import { mute } from '@use/synth'
import { clampNum } from '@use/theory'
import { getDestination, gainToDb } from 'tone'
const open = ref(false);
const volume = useStorage('main-vol', 1);

function dragVol(drag) {
  volume.value = clampNum(volume.value, -drag.delta[1] / 300, 0, 1)
  getDestination().volume.targetRampTo(gainToDb(volume.value), 0.1)
}
</script>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>