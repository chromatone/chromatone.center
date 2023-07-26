<script setup lang="ts">
import { reactive } from 'vue'
import { useTime } from './useTime'
import { levelColor, pitchColor } from '#/use'

const { time, controls, groups } = useTime()

const transport = reactive({
  width: 100,
  height: 5
})

</script>

<template lang='pug'>
.is-group.flex.flex-col

  svg.m-2(:viewBox="`0 0 ${transport.width} ${transport.height}`")
    rect(
      fill="#8881"
      stroke="#aaa"
      stroke-width=".2"
      :width="transport.width"
      :height="transport.height")

    g.beats   
      g.beat(
        v-for="(s,b) in controls['time:steps']" :key="b"
        :transform="`translate(${b*transport.width/controls['time:steps']},0)`" )
        rect(
          :width="transport.width/controls['time:steps']"
          :height="transport.height"
          :fill="b!=Math.floor(time.step) ? '#6662' : levelColor(b+(time.pitch/12)*controls['time:steps'],controls['time:steps'],1)")
        line(
          :stroke="levelColor(b+(time.pitch/12)*controls['time:steps'],controls['time:steps'])"
          stroke-width=".3"
          :y2="transport.height")
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
        :width="time.measure*transport.width"
        :height="transport.height")
      line(
        stroke="currentColor"

        stroke-width=".2"
        :x1="time.measure*transport.width"
        :x2="time.measure*transport.width"
        :y2="transport.height")

  .text-xs.p-2.gap-2.flex.flex-col
    .flex.flex-wrap.font-mono.gap-2
      .rounded.p-1.flex.flex-col.gap-1.bg-light-100.dark-bg-dark-200(v-for="(param,p) in time" :key="p")
        .text-xs {{ p }}
        .text-md {{ param?.toFixed(2) }} 
  .flex.flex-wrap.m-2.is-group.flex.flex-wrap
    .p-1.rounded-full(:style="{backgroundColor:time.pulse ? 'currentColor' : 'transparent'}")
    button.text-button(@click="controls['time:click'] = controls['time:click']? 0 : 1")
      .i-la-volume-up(v-if="!controls['time:click']")
      .i-la-volume-mute(v-else)
    template(v-for="(group,title) in groups" :key="title") 
      ControlRotary(
        v-for="(param, p) in group" :key="p"
        :min="param.min"
        :max="param.max"
        :step="param.step"
        v-model="controls[`${title}:${p}`]"
        :param="p"
        )
</template>