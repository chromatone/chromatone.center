<script setup lang="ts">
import ElemOSC from './ElemOSC.vue';
import { useDrums } from './useDrums';
import { useSequencer } from './useSequencer';

const { sequencer } = useSequencer()

</script>

<template lang='pug'>
.flex.flex-col.gap-2.is-group.p-2.bg-light-200.dark-bg-dark-200.shadow.rounded.gap-4
  .is-group.flex.flex-wrap
    ControlRotary(
      param="BPM"
      :min="20"
      :max="500"
      :step="1"
      v-model="sequencer.bpm")
    button.text-button(@click="sequencer.playing = !sequencer.playing") {{ sequencer.playing ? 'PAUSE' : 'PLAY' }}
    button.text-button(@click="sequencer.mute = !sequencer.mute") {{ !sequencer.mute ? 'MUTE' : 'UNMUTE' }}
    button.text-button(
      @mousedown="sequencer.reset = 1"
      @mouseup="sequencer.reset = 0"
      @touchstart="sequencer.reset = 1"
      @touchend="sequencer.reset = 0"
      ) RESET
    ControlRotary(
      param="Vol"
      :min="0"
      :max="1"
      :step=".001"
      v-model="sequencer.volume")
    ElemOSC.flex-1.max-h-30(name="drums")
  .flex.flex-col.gap-2 
    .flex.items-center.gap-1(
      v-for="(track,t) in sequencer.tracks" :key="t")
      .step(
        :class="{active:sequencer.hit[t]}"
        @mousedown="sequencer.hit[t]=1"
        @mouseup="sequencer.hit[t]=0"
        ) {{ t }}
      .step(
        v-for="(step,s) in track" :key="s"
        :class="{active: step == 1}"
        @click="track[s] = step ==1 ? 0: 1") 

</template>

<style scoped lang="postcss">
.step {
  @apply justify-center text-center flex-1 rounded min-h-8 bg-light-900 dark-bg-dark-50 select-none;
}

.active {
  @apply bg-dark-50 dark-bg-light-900;
}
</style>