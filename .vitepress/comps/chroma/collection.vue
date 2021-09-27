<template lang="pug">
.flex.flex-wrap.max-w-55ch.mx-auto.justify-center.my-8
  button.text-button(
    @click="current = c", 
    :class="{ active: current == c }"
    v-for="(chord,c) in collection", 
    :key="chord"
    ) {{ chord.title }}

  chroma-profile.my-4(v-bind="collection[current]")
</template>

<script setup>
const props = defineProps({
  collection: {
    type: Object,
    required: true
  }
});

const current = useStorage(`current-${Object.keys(props.collection)[0]}`, Object.keys(props.collection)[0])
</script>

<style scoped>
</style>