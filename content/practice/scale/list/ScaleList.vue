<script setup>
import scales from '#/db/scale/scale-names.yaml'
import { globalScale, rotateArray } from '#/use';
import { computed } from 'vue';

const scale = computed(() => Object.values(scales).find(s => s.chroma == globalScale.chroma))
</script>

<template lang='pug'>
.flex.flex-col.gap-4.p-4
  .flex.flex-wrap
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

</template>