<template lang="pug">
.flex(
  :style="{ opacity: lastTime ? 1 : 0.5 }"
  @mousedown="tap()",
  @touchstart="tap()"
)
  fluent-tap-double-20-regular

</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { ref } from 'vue'

const timeout = 2000

let times = []
const lastTime = ref(null)
let lastDifference = null

function tap() {
  var time = performance.now()
  if (lastTime.value) {
    lastDifference = time - lastTime.value
    times.push(lastDifference)
    refresh()
  }
  lastTime.value = time
  beginTimeout()
}

function refresh() {
  if (times.length > 2) {
    var average = times.reduce(function(result, t) { return result += t }) / times.length
    var bpm = (1 / (average / 1000)) * 60
    tempo.bpm = bpm
  }
}

let timer = null
function beginTimeout() {
  clearTimeout(timer)
  timer = setTimeout(function() {
    times = [lastDifference]
    lastTime.value = null
  }, timeout)
}
</script>

<style scoped>
</style>