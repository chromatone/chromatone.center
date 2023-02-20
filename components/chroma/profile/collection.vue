<script setup>
import { ref } from 'vue';

const props = defineProps({
  collection: {
    type: Object,
    required: true
  }
});

const current = ref(Object.keys(props.collection)[0])
</script>

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

<style lang="postcss" scoped>

</style>