<script setup>
import { lchToHsl } from '#/use/colors'
import { isDark } from '#/theme/composables/state'

const props = defineProps({
  i: {
    type: Number,
    default: 4,
  },
  total: {
    type: Number,
    default: 12
  },
  height: {
    type: Number,
    default: 6
  },
  borderWidth: {
    type: Number,
    default: 2
  }
});

const rowColor = lchToHsl(props.i, props.total);
const color = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(props.i, props.total, 1, 20, l)
});
const shadow = computed(() => `
0 0 0 ${props.borderWidth}px ${color.value}, 
0 ${props.height}px 0 2px ${color.value}
`);
const hoverShadow = computed(() => `
0 0 0 ${props.borderWidth}px ${color.value}, 
0px ${props.height * 2}px 0 2px ${color.value}
`);
</script>

<template lang="pug">
.block(
  :style="{boxShadow: shadow}"
)
  slot(:color="color")
</template>

<style lang="postcss" scoped>
.block {
  @apply rounded-2xl overflow-hidden transition-all duration-150;

  &:hover {
    @apply shadow-xl;
    /* box-shadow: v-bind(hoverShadow); */
  }
}
</style>