<script setup>
import { useAudio } from "@use/audio";
import { useMic } from "@use/mic";

const { audio, channels } = useAudio();
const { mic, input } = useMic();
</script>

<template lang="pug">
.flex.flex-col.w-full.gap-2
  .is-group.flex.p-2.gap-2
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
      :max="2"
      :step="0.001"
      param="GAIN"
      )
    control-knob(
      v-model="mic.gate"
      :min="-100"
      :max="-40"
      :step="1"
      param="GATE"
      unit="dB"
      :fixed="0"
      )
    control-meter.mr-1(:meter="mic.meter")
  .flex.flex-wrap.is-group.items-center.p-2
    .p-1.font-bold Master
    control-knob(
      param="Vol"
      v-model="audio.volume"
      :min="0"
      :max="2"
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

  .flex.flex-wrap.items-center.is-group.p-2.gap-2(v-if="Object.keys(channels).length > 0")
    .p-1.font-bold Channels
    .p-1.text-sm(v-for="(channel, title) in channels" :key="channel") {{ title }}
</template>

<style lang="postcss" scoped>
</style>
