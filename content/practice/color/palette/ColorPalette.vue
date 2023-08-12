<script setup>
import { Poline } from 'poline'
import { reactive, computed } from 'vue'

import nearestColor from 'nearest-color';
import colorNameList from 'color-name-list/dist/colornames.json';
import { colord } from 'colord';

console.log(colorNameList)

// nearestColor need objects {name => hex} as input
const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

const nearest = nearestColor.from(colors);


const options = reactive({
  numPoints: 3
})

const palette = computed(() => new Poline(options).colors)

function toHSL(color) {
  return `hsl(${color[0]},${color[1] * 100}%,${color[2] * 100}%)`
}

</script>

<template lang='pug'>
.flex.flex-col.gap-4
  .flex.flex-wrap.gap-2.is-group.p-2
    control-rotary(
      v-model="options.numPoints"
      :max="20"
      :min="1"
      :step="1"
      param="Steps"
      :fixed="0"
      )

  .flex.flex-col.rounded-2xl.overflow-hidden
    transition-group(name="fade")
      .py-2.px-4.font-bold.flex.gap-4(
        v-for="(color,c) in palette" :key="c"
        :style="{backgroundColor:toHSL(color), color:colord(toHSL(color)).isDark() ? '#fff' : '#000'}"
        )
        .p-0 {{c}}
        .p-0 {{ nearest(colord(toHSL(color)).toHex()).name }}
        .flex-1
        .p-0 {{ colord(toHSL(color)).toHex() }}
</template>