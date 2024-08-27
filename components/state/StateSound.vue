<script setup>
import { useAudio } from "#/use/audio";
import { useMicrophone } from "#/use/mic";

const { audio, channels } = useAudio();
const { mic, input } = useMicrophone();
</script>

<template lang="pug">
.flex.flex-wrap.w-full.gap-2
  .is-group.flex.flex-wrap.p-2.gap-2
    button.flex-button.relative.overflow-hidden(@click="mic.open = !mic.open", :class="{ active: mic.open }", v-tooltip.top="'Enable microphone'")
      .i-ph-microphone.z-10.relative(v-if="!mic.opened")
      .i-ph-microphone-fill.z-10.relative(v-else)
      .m-0 Mic
    button.flex-button(:class="{ active: mic.monitor }", @click="mic.monitor = !mic.monitor", v-tooltip.top="'Connect microphone to output'")
      .i-ph-ear
      .m-0 Monitoring
    control-rotary(v-model="mic.volume", :min="0", :max="5", :step="0.001", param="GAIN", v-tooltip.bottom="'Microphone volume'")
    control-rotary(v-model="mic.gate", :min="-100", :max="-40", :step="1", param="GATE", unit="dB", :fixed="0", v-tooltip.bottom="'Noise gate'")
    control-level.mr-1(:meter="mic.meter")
  .flex.flex-wrap.is-group.items-center.p-2.gap-2
    .p-1.font-bold Master
    control-rotary(param="Vol", v-model="audio.volume", :min="0", :max="2", :step="0.001", v-tooltip.bottom="'Master volume'")
    button.text-button.border.mute.mt-24(@click="audio.mute = !audio.mute", :class="{ active: !audio.mute }", aria-label="Toggle mute", v-tooltip.top="'Toggle mute'")
      .i-bi-volume-up(v-if="!audio.mute")
      .i-bi-volume-mute(v-else)
    control-level.mr-1(:meter="audio.meter")
  .flex.flex-wrap.items-center.is-group.p-2.gap-2(v-if="Object.keys(channels).length > 0")
    .p-1.font-bold Channels
    .p-1.text-sm(v-for="(channel, title) in channels", :key="title") {{ title }}
  cast-panel
</template>

<style lang="postcss" scoped></style>
