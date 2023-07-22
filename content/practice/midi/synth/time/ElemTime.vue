<script setup lang="ts">
import { useTime } from './useTime'

const { time, controls, groups, } = useTime()

</script>

<template lang='pug'>
.is-group.flex.flex-col
  .text-xs.p-2.gap-2.flex.flex-col
    .flex.flex-wrap.font-mono.gap-2
      .rounded.p-1.flex.flex-col.gap-1.bg-light-100(v-for="(param,p) in time" :key="p")
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