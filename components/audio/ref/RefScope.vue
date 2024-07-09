<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { default: () => ([]), type: Array },
  color: { default: 'currentColor', type: String },
})

const points = computed(() => props.data.map((v, i) => [i, v * 50].join(',')).join(' '))

</script>

<template lang='pug'>
svg(ref="svgElem" v-show="data?.length > 2" :viewBox="`0 -25 ${data.length} 50`")
  polyline(
    stroke-width="2"
    :stroke="color"
    fill="transparent"
    :points="points"
    )
</template>