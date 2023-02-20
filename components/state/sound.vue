<script setup>
import { useAudio } from "#/use/audio";
import { useMic } from "#/use/mic";

const { audio, channels } = useAudio();
const { mic, input } = useMic();
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <div class="is-group flex p-2 gap-2"><button class="flex-button relative overflow-hidden"
        @click="mic.open = !mic.open" :class="{ active: mic.open }" v-tooltip.top="'Enable microphone'">
        <div class="i-ph-microphone z-10 relative" v-if="!mic.opened"></div>
        <div class="i-ph-microphone-fill z-10 relative" v-else></div>
        <div class="m-0">Mic</div>
      </button><button class="flex-button" :class="{ active: mic.monitor }" @click="mic.monitor = !mic.monitor"
        v-tooltip.top="'Connect microphone to output'">
        <div class="i-ph-ear"></div>
        <div class="m-0">Monitoring</div>
      </button><control-rotary v-model="mic.volume" :min="0" :max="2" :step="0.001" param="GAIN"
        v-tooltip.bottom="'Microphone volume'"></control-rotary><control-rotary v-model="mic.gate" :min="-100"
        :max="-40" :step="1" param="GATE" unit="dB" :fixed="0"
        v-tooltip.bottom="'Noise gate'"></control-rotary><control-level class="mr-1" :meter="mic.meter"></control-level>
    </div>
    <div class="flex flex-wrap is-group items-center p-2 gap-2">
      <div class="p-1 font-bold">Master</div><control-rotary param="Vol" v-model="audio.volume" :min="0" :max="2"
        :step="0.001" v-tooltip.bottom="'Master volume'"></control-rotary><button class="text-button border mute mt-24"
        @click="audio.mute = !audio.mute" :class="{ active: !audio.mute }" aria-label="Toggle mute"
        v-tooltip.top="'Toggle mute'">
        <div class="i-bi-volume-up" v-if="!audio.mute"></div>
        <div class="i-bi-volume-mute" v-else></div>
      </button><control-level class="mr-1" :meter="audio.meter"></control-level>
    </div>
    <div class="flex flex-wrap items-center is-group p-2 gap-2" v-if="Object.keys(channels).length > 0">
      <div class="p-1 font-bold">Channels</div>
      <div class="p-1 text-sm" v-for="(channel, title) in channels" :key="channel">{{ title }}</div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
