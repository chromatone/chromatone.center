<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from '../audio/useAudio'

const props = defineProps({
  name: { default: 'osc', type: String },
  color: { default: 'currentColor', type: String },
})

function useScope(name = 'osc') {

  const { scopes } = useAudio()

  const analyser = reactive({
    data: computed(() => scopes[name] || []),
    points: computed(() => analyser.data.map((v: number, i: number) => [i, v * 25].join(',')).join(' ')),
  })

  return analyser
}

const analyser = useScope(props.name)
</script>

<template lang='pug'>
svg.mix-blend-difference(ref="svgElem" v-show="analyser?.data?.length>2" :viewBox="`0 -25 ${analyser.data.length} 50`")
  polyline(
    stroke-width="2"
    :stroke="color"
    fill="transparent"
    :points="analyser.points"
    )
</template>