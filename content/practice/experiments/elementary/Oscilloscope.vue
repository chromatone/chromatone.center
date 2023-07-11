<script setup>
import { useAnalyser } from './useAnalyser';

const props = defineProps({
  name: { default: 'osc', type: String }
})

const analyser = useAnalyser(props.name)
</script>

<template lang='pug'>
svg.mix-blend-difference(ref="svgElem" v-show="analyser.data.length>2" :viewBox="`0 -25 ${analyser.data.length} 50`")
  polyline(
    stroke-width="2"
    stroke="currentColor"
    fill="transparent"
    :points="analyser.points"
    )
</template>