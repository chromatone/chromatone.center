<script setup>
import scales from '#/db/scales/scale-names.yaml'
import { globalScale, pitchColor, rotateArray } from '#/use';
import { computed, ref } from 'vue';

const scale = computed(() => Object.values(scales).find(s => s.chroma == globalScale.chroma))

const current = ref(851)
</script>

<template lang='pug'>
.flex

  .flex.flex-col.overflow-y-scroll.min-w-40.p-2.max-h-90vh.items-start.overflow-x-hidden
    .font-mono.border-1.text-xs.flex.gap-1.p-1.rounded-lg.hover-bg-light-900.dark-hover-bg-dark-900.transition(
      v-for="scale in Object.values(scales)" :key="scale.chroma"
      @click="globalScale.chroma = scale.chroma"
      :style="{ borderColor: globalScale.chroma == scale.chroma ? '#888' : 'transparent' }"
      )
      .p-4px.rounded-full(
        v-for="(on, pitch) in scale.chroma" :key="pitch"
        :style="{ backgroundColor: on == 1 ? pitchColor(pitch + globalScale.tonic, 3) : 'hsla(0deg,0%,50%,10%)' }"
        )

  .flex.flex-col.gap-4.p-4.w-full
    .flex.flex-wrap.gap-4
      ControlScale.flex-1(
        style="flex: 0 1 300px"
        )
      ChromaRow(
        style="flex: 1 1 60%"
        v-model:chroma="globalScale.chroma" editable) 
        .text-xl {{ scale?.title }}
    .flex.flex-wrap
      .flex.flex-wrap.gap-4.p-1(v-for="(cat, c) in scale?.names")
        .op-70 {{ c }}:
        .p-0(v-for="name in cat" :key="name") {{ name }}

    .flex.flex-col.gap-2.p-2 
      .text-lg Total possible scales: {{ Object.keys(scales).length }} 
</template>