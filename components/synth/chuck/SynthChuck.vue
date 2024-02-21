<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import { Chuck } from 'webchuck'

const examples = import.meta.glob('./examples/*.ck', { query: '?raw', eager: true })

console.log(examples)

function getFileName(path) {
  return path.match(/([^./]+)(?=\.[^.]*$|$)/)[1];
}

const webChuck = shallowRef()
const initiated = ref(false)
const command = ref(examples['./examples/brass.ck']?.default)

onMounted(async () => {
  await init()
  webChuck.value.onprocessorerror = e => {
    console.warn(e)
  }
  initiated.value = true
})

async function init() {
  webChuck.value = await Chuck.init([]);
}

</script>

<template lang='pug'>
.flex.flex-col.gap-2
  .text-3xl CHUCK 
  .text-sm Paste any ChucK code and press Run to hear generated sound. 
  textarea.font-mono.text-sm.p-2.w-full.dark-bg-dark-200.rounded-lg(v-model="command" cols="55" rows="20")
  .flex.flex-wrap.gap-2
    .p-2.text-green-600.dark-text-green-300(v-if="initiated") READY
    .p-2.text-orange-600.dark-text-orange-300(v-else @click="init()") INIT
    button.text-button.flex-1(@click="webChuck.runCode(command)") RUN
    button.text-button.flex-1(@click="webChuck.replaceCode(command)") RERUN 
    button.text-button.flex-1(@click="webChuck.removeLastCode()") STOP
  .flex.flex-wrap.gap-2 
    .p-2.border-1.rounded-lg.border-dark-200.cursor-pointer(
      :class="{active:example?.default == command}"
      v-for="(example,path) in examples" :key="example"
      @click="command = example?.default"
      ) {{ getFileName(path) }} 
</template>

<style lang="postcss" scoped>
.active {
  @apply border-light-100
}
</style>