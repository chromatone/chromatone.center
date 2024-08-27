<!-- Sensors.vue -->
<template>
  <div class="sensors">
    <h2>Motion Sensor</h2>
    <button @click="activateMotion" :disabled="isMotionActive">Activate Motion</button>
    <button @click="deactivateMotion" :disabled="!isMotionActive">Deactivate Motion</button>
    <p v-if="isMotionActive">
      X: {{ motion.x.toFixed(2) }}<br>
      Y: {{ motion.y.toFixed(2) }}<br>
      Z: {{ motion.z.toFixed(2) }}
    </p>
    <p v-else>Motion sensor inactive</p>

    <h2>Orientation Sensor</h2>
    <button @click="activateOrientation" :disabled="isOrientationActive">Activate Orientation</button>
    <button @click="deactivateOrientation" :disabled="!isOrientationActive">Deactivate Orientation</button>
    <p v-if="isOrientationActive">
      Alpha: {{ orientation.alpha.toFixed(2) }}<br>
      Beta: {{ orientation.beta.toFixed(2) }}<br>
      Gamma: {{ orientation.gamma.toFixed(2) }}
    </p>
    <p v-else>Orientation sensor inactive</p>
  </div>
</template>

<script setup>
import { useSensors } from './useSensors'

const {
  motion,
  orientation,
  isMotionActive,
  isOrientationActive,
  activateMotion,
  activateOrientation,
  deactivateMotion,
  deactivateOrientation
} = useSensors()
</script>

<style scoped>
.sensors {
  font-family: Arial, sans-serif;
  padding: 20px;
}

button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>