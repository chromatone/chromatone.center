<script setup lang="ts">
import { reactive } from 'vue'
import { useTime } from './useTime'
import { levelColor } from '#/use'

const { time, controls, groups, } = useTime()

const transport = reactive({
  width: 100,
  height: 5
})

</script>

<template lang='pug'>
.is-group.flex.flex-col 
  svg.m-2(:viewBox="`0 0 ${transport.width} ${transport.height}`")
    rect(
      stroke="#aaa"
      stroke-width=".2"
      :width="transport.width"
      :height="transport.height"
    )
    rect(
      stroke="#aaa"
      stroke-width=".2"
      :fill="levelColor(time.measure,1)"
      :width="time.measure*transport.width"
      :height="transport.height"
      )
    g.beats   
      g.beat(
        v-for="b in controls['time:steps']" :key="b"
        :transform="`translate(${b*transport.width/controls['time:steps']},0)`"
        )
        line(
          :stroke="levelColor(b,controls['time:steps'])"
          stroke-width=".2"
          :y2="transport.height"

        )
  .text-xs.p-2.gap-2.flex.flex-col
    .flex.flex-wrap.font-mono.gap-2
      .rounded.p-1.flex.flex-col.gap-1.bg-light-100.dark-bg-dark-200(v-for="(param,p) in time" :key="p")
        .text-xs {{ p }}
        .text-md {{ param?.toFixed(2) }} 

  .flex.flex-wrap.gap-2(v-for="(group,title) in groups" :key="title") 
    ControlRotary(
      v-for="(param, p) in group" :key="p"
      :min="param.min"
      :max="param.max"
      :step="param.step"
      v-model="controls[`${title}:${p}`]"
      :param="p"
      )
</template>