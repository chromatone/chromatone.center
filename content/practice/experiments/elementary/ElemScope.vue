<script setup lang="ts">
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useElemAudio } from './useElemAudio'

const props = defineProps({
  title: { default: 'osc', type: String }
})

const { scopes } = useElemAudio()

const points = computed(() => scopes?.[props.title]?.map((v: number, i: number) => [i, v * 25].join(',')).join(' '))


</script>

<template lang='pug'>
svg.mix-blend-difference(ref="svgElem" v-show="scopes?.[title]?.length>2" :viewBox="`0 -25 ${scopes?.[title]?.length} 50`")
  polyline(
    stroke-width="2"
    stroke="currentColor"
    fill="transparent"
    :points="points"
    )
</template>