<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useTime } from './useTime'
import { levelColor, notes, pitchColor } from '#/use'
import { useAudio } from '../useAudio';
import { useDateFormat } from '@vueuse/core';

import ElemMetronome from './ElemMetronome.vue'

const { time, controls, groups, transport } = useTime()

const loop = reactive({
  width: 100,
  height: 5
})

const { render, audio } = useAudio()

const started = useDateFormat(() => audio.started, 'YYYY MMM DD @ HH:MM:ss  ')

</script>

<template lang='pug'>
.flex.flex-col.gap-2
  h2  Musical time: From samples to measures
  h3 Click anywhere to start 
  .text-center.grid.gap-2.text-md.items-center.justify-center.font-mono.p-4.max-w-60ch(
    style="grid-template-columns: 3fr 3fr 3fr;"
    :style="{opacity: audio?.started ? 1 : 0.4}"
    @click="render()")

    .col-span-3.font-bold Let's start to watch time passing

    .text-right Started at: 
    .p-0.font-bold {{ Number(audio?.started).toLocaleString() }}
    .text-left.text-sm milliseconds

    .text-right Local time: 
    .p-0.col-span-2.font-bold {{ started }}


    .col-span-3.font-bold We have a timer ever increasing at a fixed rate 

    .text-right Timer: 
    .p-0.font-bold {{ Number(time?.time || 0 ).toLocaleString()}}
    .text-left.text-sm samples

    .text-right Sample Rate: 
    .p-0.font-bold {{ Number(time?.['sample-rate']|| 44100).toLocaleString()  }}
    .text-left.text-sm samples per second

    .col-span-3.font-bold Divide the sample count by the sample rate to get elapsed seconds 

    .text-right Seconds: 
    .p-0.font-bold {{ time?.['seconds']?.toFixed(2) || 0 }}
    .text-left.text-sm seconds

    .text-right Minutes:
    .p-0.font-bold {{ time?.['minutes']?.toFixed(2)  || 0 }}
    .text-left.text-sm minutes

    .text-right Hours:
    .p-0.font-bold {{ time?.['hours']?.toFixed(2)  || 0 }}
    .text-left.text-sm hours

    .col-span-3.font-bold We need a transport to be able play, pause and reset relative time

    .col-span-3.font-bold.flex.flex-wrap.m-2.flex.flex-wrap.justify-center(v-if="audio?.started")
      button.text-button(@click="transport.play()")
        .i-la-play
      button.text-button(@click=" transport.pause()")
        .i-la-pause
      button.text-button(@click="transport.stop()")
        .i-la-stop

    .text-right Started At:
    .p-0.font-bold {{ transport?.started?.toFixed(2) || 0 }}
    .text-left.text-sm seconds

    .text-right Paused At:
    .p-0.font-bold {{ transport?.paused?.toFixed(2) || 0 }}
    .text-left.text-sm seconds

    .text-right Started:
    .p-0.font-bold(:class="{['active']: time?.isStarted}")  {{ time?.isStarted }}
    .text-left.text-sm Started &gt; 0?

    .text-right Paused:
    .p-0.font-bold(:class="{['active']: time?.isPaused}")  {{ time?.isPaused }}
    .text-left.text-sm Paused &gt; 0?

    .text-right Playing:
    .p-0.font-bold(:class="{['active']: time?.isPlaying}")   {{ time?.isPlaying }}
    .text-left.text-sm Started & not Paused

    .col-span-3.font-bold Now we just subtract current time from start/pause time

    .text-right Transport time:
    .p-0.font-bold  {{ time?.current?.toFixed(2) }}
    .text-left.text-sm seconds

    .col-span-3.font-bold But we want some musical time, so we need to set a beat rate

    .text-right BPM:
    .p-0.font-bold.flex.items-center.gap-2.justify-center
      .i-la-minus(@click="controls['time:bpm']--")
      .p-0 {{ time?.bpm?.toFixed(1) || 120 }}
      .i-la-plus(@click="controls['time:bpm']++")
    .text-left.text-sm beats per minute

    .text-right BPS:
    .p-0.font-bold {{ time?.bps?.toFixed(1) || 2 }}
    .text-left.text-sm Hz

    .text-right Pitch:
    .p-0.font-bold(:style="{backgroundColor: pitchColor((time?.pitch+12),3,1,0.5)}") {{ (time?.pitch+12)?.toFixed(1) || 2 }}
    .text-left.text-sm note

    .text-right Note:
    .p-0.font-bold(:style="{color: pitchColor((time?.pitch+12),3)}") {{ notes[Math.round(time?.pitch+12)%12]}}
    .text-left.text-sm {{ (100*((time?.pitch+12)%12 - Math.round(time?.pitch+12)%12)).toFixed(2) }} %

    .col-span-3.font-bold Now we can calculate beats elapsed, beat progress and generate pulse

    .text-right Beats:
    .p-0.font-bold {{ time?.beats?.toFixed(1) || 0 }}
    .text-left.text-sm beats

    .text-right Beat progress:
    .p-0.font-bold {{ time?.beat?.toFixed(4) || 0 }}
    .text-left.text-sm Beats % 1

    .text-right Pulse:
    .p-0.font-bold(:class="{['active']: time?.pulse}") {{ time?.pulse || 0 }}
    .text-left.text-sm Beat &lt; 0.5?

    .col-span-3.font-bold Musical rhythm has a pattern of strong and weak beats in a measure

    .text-right Beats per measure:
    .p-0.font-bold.flex.items-center.gap-2.justify-center
      .i-la-minus(@click="controls['time:steps']--")
      .p-0 {{ time?.steps?.toFixed(0) || 4 }}
      .i-la-plus(@click="controls['time:steps']++")
    .text-left.text-sm beats

    .text-right Measures:
    .p-0.font-bold {{ time?.measures?.toFixed(4) || 0 }}
    .text-left.text-sm Beats / Beats per measure

    .col-span-3.font-bold Now we can get our musical time coordinates

    .text-right Measure progress:
    .p-0.font-bold.relative {{ time?.measure?.toFixed(4) || 0 }}
      .absolute.top-0.bottom-0.left-0.active(:style="{width:`${time?.measure*100}%`}")
    .text-left.text-sm Measures % 1

    .text-right Step:
    .p-0.font-bold.relative {{time?.['step-num']+1 || 0 }} / {{ time?.steps?.toFixed(0) || 4 }}
      .absolute.top-0.bottom-0.left-0.active(:style="{width:`${(time?.['step-num']) / time?.steps?.toFixed(0) * 100}%`}")
    .text-left.text-sm Beats / Beats per measure

    .text-right First step:
    .p-0.font-bold(:class="{['active']: time?.['step-first']}") {{time?.['step-first'] }}
    .text-left.text-sm Step == 1?

    .text-right Odd step:
    .p-0.font-bold(:class="{['active']: time?.['step-odd']}") {{time?.['step-odd'] }}
    .text-left.text-sm Step % 2?

    .text-right Even step:
    .p-0.font-bold(:class="{['active']: time?.['step-even']}") {{time?.['step-even'] }}
    .text-left.text-sm Not Odd

  ElemMetronome.fixed.bottom-2
</template>

<style scoped lang="postcss">
.active {
  @apply bg-dark-300 dark-bg-light-300 bg-opacity-40 dark-bg-opacity-40;
}
</style>