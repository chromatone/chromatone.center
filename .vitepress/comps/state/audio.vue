<script setup>
import { useAudio } from '@use/audio'
import { onClickOutside } from '@vueuse/core'
import { useMic } from '@use/mic'
import { useRecorder } from '@use/recorder'

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

const { mic, input }  = useMic()

const {record, recording, toggled, duration} = useRecorder()

</script>

<template lang="pug">
.btn.w-10
  button.p-2.text-xl(
    @click.stop.prevent="open = true"
    :class="{active: open}"
    aria-label="Toggle mute"
    )
    bi-volume-up(v-if="!audio.mute")
    bi-volume-mute(v-else)
  client-only
    transition(name="panel")
      .panel(v-if="open" ref="panel")
        button.text-button.relative.overflow-hidden(
          @click="mic.open = !mic.open"
        )
          ph-microphone.z-10.relative(v-if="!mic.opened")
          ph-microphone-fill.z-10.relative(v-else)
          .absolute.bottom-0.left-0.w-full.transition-all.duration-50ms(:style="{height: mic.meter*100 + '%', backgroundColor: `hsl(${200-mic.meter*200},90%,50%)`}")
        control-knob(
          v-model="mic.volume"
          :min="0"
          :max="1"
          :step="0.001"
          param="VOL"
        )
        button.text-button(:class="{active: mic.monitor}" @click="mic.monitor = !mic.monitor")
          ph-ear
        button.text-button(@click="record.start()" v-if="!recording") 
          mdi-checkbox-blank-circle-outline
        button.text-button.flex.items-center.text-red-500(@click="record.stop()" v-else)  
          mdi-checkbox-blank-circle.animate-pulse
          .p-1 {{(duration/1000).toFixed(1)}} s
        .flex-1
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

<style lang="postcss" scoped>
.active {
  @apply bg-dark-50 bg-opacity-30 rounded-xl;
}
.panel {
  @apply flex flex-wrap z-100 absolute bg-light-400 dark_bg-dark-400 shadow-lg rounded-xl p-2 right-0 top-$header-height w-full;
}

</style>