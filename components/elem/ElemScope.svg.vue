<script setup>
import { computed } from 'vue'
import { useElementary } from "#/use/elem/useElementary";

const props = defineProps({
  name: { default: 'synth', type: String },
  color: { default: 'currentColor', type: String },
})

const { scopes } = useElementary()

const points = computed(() => scopes[props.name] ? scopes[props.name].map((v, i) => [i, v * 50].join(',')).join(' ') : '')

</script>

<template lang='pug'>
svg.w-full.h-30(ref="svgElem" v-if="scopes[name]?.length > 2" :viewBox="`0 -25 ${scopes[name]?.length} 50`")
  polyline(
    stroke-width="2"
    :stroke="color"
    fill="transparent"
    :points="points"
    )
</template>