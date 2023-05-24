<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import bh from './blowhole.ck?raw'
import { Chuck } from 'webchuck'

const webChuck = shallowRef()
const initiated = ref(false)
const command = ref(bh)

onMounted(async () => {
  webChuck.value = await Chuck.init([]);
  initiated.value = true
  webChuck.value.addEventListener('processorerror', e => {
    console.warn(e)
  })
})

async function runChuck() {
  webChuck.value?.runCode(command.value);
}

function stopChuck() {
  webChuck.value?.removeLastCode()
}

</script>

<template lang='pug'>
.flex.flex-col.gap-2
  .text-3xl CHUCK 
  .text-sm Paste any ChucK code and press Run to hear generated sound. 
  textarea.font-mono.text-sm.p-2.w-full.dark-bg-dark-200.rounded-lg(v-model="command" cols="55" rows="20")
  .flex.flex-wrap.gap-2
    .p-2.text-green-600.dark-text-green-300(v-if="initiated") READY
    button.text-button.flex-1(@click="runChuck()") RUN 
    button.text-button.flex-1(@click="stopChuck()") STOP 
</template>