<script setup>
import { computed, reactive } from 'vue'
import { useElementary } from '#/use/elementary/useElementary';

const props = defineProps({
  name: { default: 'osc', type: String },
  color: { default: 'currentColor', type: String },
})

function useScope(name = 'osc') {

  const { scopes } = useElementary()

  const analyser = reactive({
    data: computed(() => scopes[name] || []),
    points: computed(() => analyser.data.map((v, i) => [i, v * 25].join(',')).join(' ')),
  })

  return analyser
}

const analyser = useScope(props.name)
</script>

<template lang='pug'>
svg(ref="svgElem" v-show="analyser?.data?.length > 2" :viewBox="`0 -25 ${analyser.data.length} 50`")
  polyline(
    stroke-width="2"
    :stroke="color"
    fill="transparent"
    :points="analyser.points"
    )
</template>