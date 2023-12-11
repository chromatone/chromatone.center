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
.flex.flex-wrap.flex-col.max-w-150.mx-2.sm-mx-4.embed
  .flex.flex-wrap
    button.text-button(
      @click="current = c", 
      :class="{ active: current == c }"
      v-for="(chord,c) in collection", 
      :key="chord"
      ) {{ chord.title }}

  chroma-profile.my-4(v-bind="collection[current]")
</template>

<style lang="postcss" scoped></style>