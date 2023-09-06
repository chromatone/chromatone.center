<script setup>
import { ref } from 'vue';

const props = defineProps({
  svg: { type: String, default: '' },
  password: { type: String, default: 'printable-papers' },
})

const pass = ref('')
</script>

<template lang='pug'>
.flex.flex-wrap.items-center.gap-4.bg-light-900.dark-bg-dark-300.rounded-lg.shadow-lg.max-w-55ch.ml-5.p-4
  .text-lg.font-bold Download file:

  template(v-if="pass == password")
    save-svg(:svg="svg")
    save-pdf(:svg="svg")

  input.rounded.dark-bg-dark-800.p-1(
    v-model="pass" 
    v-else
    placeholder="Paste your download code"
    )
</template>