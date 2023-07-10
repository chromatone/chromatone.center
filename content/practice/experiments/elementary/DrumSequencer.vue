<script setup lang="ts">
import { useSequencer } from './useSequencer';

const { sequencer } = useSequencer()

</script>

<template lang='pug'>
.p-0.flex.flex-col.gap-4
  .p-2 SEQ 
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

  .flex.flex-col.gap-2 
    .flex.items-center.gap-1(
      v-for="(track,t) in sequencer.tracks" :key="t")
      .step(
        v-for="(step,s) in track" :key="s"
        :class="{active: step == 1}"
        @click="track[s] = step ==1 ? 0: 1") 
</template>

<style scoped lang="postcss">
.step {
  @apply flex-1 rounded min-h-8 bg-light-900;
}

.active {
  @apply bg-dark-50;
}
</style>