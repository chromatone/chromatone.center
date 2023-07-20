<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useAudio } from '../useAudio'

const props = defineProps({
  name: { default: 'osc', type: String }
})

function useScope(name = 'osc') {

  const analyser = reactive({
    initiated: false,
    data: [],
    points: computed(() => analyser.data.map((v: number, i: number) => [i, v * 25].join(',')).join(' ')),
    async init() {
      const { audio } = useAudio()

      audio.core.on('scope', (e) => {
        if (e?.source == name) {
          let arr = [...e?.data[0].values()]
          // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
          analyser.data = arr //.slice(zeroCross)
        }
      })
    }
  })

  if (!analyser.initiated) {
    analyser.init()
    analyser.initiated = true
  }
  return analyser
}

const analyser = useScope(props.name)
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