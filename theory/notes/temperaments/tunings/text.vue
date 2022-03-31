<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 24
  },
  text: {
    type: String,
    default: 'Circle text'
  },
  w: {
    type: Number,
    default: 1000,
  },
  r: {
    type: Number,
    default: 450,
  },
  offset: {
    type: Number,
    default: 3,
  }
});

const id = 'myText' + Math.floor(Math.random() * 20);
</script>

<template lang="pug">
g  
  defs
    path(:id="`myTextPath${r}`",:d="`M ${r},0 A ${r},${r} 0 0 1 -${r},0 A ${r},${r} 0 0 1 ${r},0`", :transform="`translate(${w / 2},${w / 2}), rotate(-90)`", fill="none", stroke="darkblue", stroke-width="2")
  text(
    fill="currentColor"
    font-size="24px"
  )
    textPath(
      :xlink:href="`#myTextPath${r}`"
      :startOffset="`${offset}%`"
    ) {{ text }}
</template>

<style lang="postcss" scoped>
</style>