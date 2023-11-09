<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useTime } from './useTime'
import { levelColor, pitchColor } from '#/use'
import { useAudio } from '../useAudio';

const { time, controls, groups, transport } = useTime()

const loop = reactive({
  width: 100,
  height: 5
})

const { render, audio } = useAudio()



</script>

<template lang='pug'>
.is-group.flex.flex-col(@click="render()")
  .p-4.absolute.bg-light-300.shadow-lg.m-8(

    v-if="!audio.started"
    ) START
  svg.m-2(:viewBox="`0 0 ${loop.width} ${loop.height}`")
    rect(
      fill="#8881"
      stroke="#aaa"
      stroke-width=".2"
      :width="loop.width"
      :height="loop.height")

    g.beats   
      g.beat(
        v-for="(s,b) in controls['time:steps']" :key="b"
        :transform="`translate(${b*loop.width/controls['time:steps']},0)`" )
        rect(
          :width="loop.width/controls['time:steps']"
          :height="loop.height"
          :fill="b!=Math.floor(time.step) ? '#6662' : levelColor(b+(time.pitch/12)*controls['time:steps'],controls['time:steps'],1)")
        line(
          :stroke="levelColor(b+(time.pitch/12)*controls['time:steps'],controls['time:steps'])"
          stroke-width=".3"
          :y2="loop.height")
        text(
          x="1"
          y="2.5"
          font-size="2"
          :fill="b==Math.floor(time.step) ? 'currentColor' : levelColor(b+(time.pitch/12)*controls['time:steps'],controls['time:steps'],1)"
          :font-weight="b==Math.floor(time.step) ? 'bold' : 'normal'"
        ) {{ s }}

    g.progress
      rect(
        :fill="pitchColor(time.pitch)"
        fill-opacity=".2"
        :width="time.measure*loop.width"
        :height="loop.height")
      line(
        stroke="currentColor"

        stroke-width=".2"
        :x1="time.measure*loop.width"
        :x2="time.measure*loop.width"
        :y2="loop.height")
  //- .text-xs.p-2.gap-2.flex.flex-col
  //-   .flex.flex-wrap.font-mono.gap-2
  //-     .rounded.p-1.flex.flex-col.gap-1.bg-light-100.dark-bg-dark-200(v-for="(param,p) in time" :key="p")
  //-       .text-xs {{ p }}
  //-       .text-md {{ param?.toFixed(2) }} 
  .flex.flex-wrap.m-2.is-group.flex.flex-wrap
    .p-1.rounded-full(:style="{backgroundColor:time.pulse ? 'currentColor' : 'transparent'}")
    button.text-button(@click="time.isPlaying ? transport.pause() : transport.play()")
      .i-la-play(v-if="!time.isPlaying")
      .i-la-pause(v-else)
    button.text-button(@click="transport.stop()")
      .i-la-stop
    button.text-button(@click="controls['time:click'] = controls['time:click']? 0 : 1")
      .i-la-volume-up(v-if="controls['time:click']")
      .i-la-volume-mute(v-else)
    template(v-for="(group,title) in groups" :key="title") 
      ControlRotary(
        v-for="(param, p) in group" :key="p"
        :min="param.min"
        :max="param.max"
        :step="param.step"
        v-model="controls[`${title}:${p}`]"
        :param="String(p)"
        )
</template>