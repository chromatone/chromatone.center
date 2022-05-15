<script setup>
import { useAudio } from "@use/audio";
import { useMic } from "@use/mic";

const { audio } = useAudio();
const { mic, input } = useMic();
</script>

<template lang="pug">
.flex.flex-wrap.w-full
  .is-group.flex
    button.flex-button.relative.overflow-hidden(
      @click="mic.open = !mic.open"
      :class="{ active: mic.open }"
      )
      ph-microphone.z-10.relative(v-if="!mic.opened")
      ph-microphone-fill.z-10.relative(v-else)
      .m-0 Mic
    button.flex-button(:class="{ active: mic.monitor }" @click="mic.monitor = !mic.monitor")
      ph-ear
      .m-0 Monitoring

    control-knob(
      v-model="mic.volume"
      :min="0"
      :max="1"
      :step="0.001"
      param="GAIN"
      )
    control-meter.mr-1(:meter="mic.meter")
  .flex-1
  .flex.flex-wrap.is-group
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
    control-meter.mr-1(:meter="audio.meter")
</template>

<style lang="postcss" scoped>
</style>
