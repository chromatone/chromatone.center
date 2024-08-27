<script setup>
import { useDeviceMotion, useDeviceOrientation } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const { acceleration: acc, accelerationIncludingGravity, rotationRate, interval } = useDeviceMotion()
const { isAbsolute, alpha, beta, gamma, } = useDeviceOrientation()

function activate() {
  DeviceMotionEvent.requestPermission()
}

const lp = 0.9
const windowSize = 10

const lowPassAcc = computed(oldValue =>
  oldValue ? Object.assign({}, ...['x', 'y', 'z'].map(axis => ({
    [axis]: lp * oldValue[axis] + (1 - lp) * acc.value[axis]
  }))) : acc.value
)

const movAvgAcc = computed(oldValue => {
  const buffer = (oldValue?.buffer || []).concat(acc.value).slice(-windowSize);
  return Object.assign({}, ...['x', 'y', 'z'].map(axis => ({
    [axis]: buffer.reduce((sum, val) => sum + val[axis], 0) / buffer.length
  })), { buffer });
})

const scalarAcc = computed(() =>
  Math.sqrt(['x', 'y', 'z'].reduce((sum, axis) => sum + acc.value[axis] ** 2, 0))
)

</script>

<template lang="pug">
.p-4.flex.flex-col.gap-2
  .flex.flex-wrap
    button.text-button(@click="activate") Activate 
    .p-2.top-4() {{ isAbsolute ? 'ABS' : 'REL' }}
    .p-2 {{ scalarAcc.toFixed(2) }}
  .flex.flex-wrap.gap-2
    .flex.flex-col.flex-1
      .flex-1 X: {{ acc?.x?.toFixed(2) }}
      .flex-1 Y: {{ acc?.y?.toFixed(2) }}
      .flex-1 Z: {{ acc?.z?.toFixed(2) }}
    .flex.flex-col.flex-1
      .flex-1 av-X: {{ movAvgAcc?.x?.toFixed(2) }}
      .flex-1 av-Y: {{ movAvgAcc?.y?.toFixed(2) }}
      .flex-1 av-Z: {{ movAvgAcc?.z?.toFixed(2) }}
    .flex.flex-col.flex-1
      .flex-1 R-alpha: {{ rotationRate?.alpha?.toFixed(2) }}
      .flex-1 R-beta: {{ rotationRate?.beta?.toFixed(2) }}
      .flex-1 R-gamma: {{ rotationRate?.gamma?.toFixed(2) }}
    .flex.flex-col.flex-1
      .flex-1 alpha: {{ alpha?.toFixed(2) }}
      .flex-1 beta: {{ beta?.toFixed(2) }}
      .flex-1 gamma: {{ gamma?.toFixed(2) }}
  .flex-1.p-40(:style="{ borderRadius: `${scalarAcc * 10}px`, backgroundColor: `hsl(${alpha}deg ${50 + 50 * beta / 180}% ${50 + 50 * gamma / 90}%)` }")
</template>

<style scoped></style>