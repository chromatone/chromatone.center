<script setup>
const props = defineProps({
  source: { type: Object, default: () => ({}) }
})
</script>

<template lang='pug'>
ChromaRow.my-4(
  :chroma="source.chroma"
  :two-row="false"
)
</template>