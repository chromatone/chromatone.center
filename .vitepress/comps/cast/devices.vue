<script setup>
import {
  currentCamera, currentMic,
  cameras,
  ensureDevicesListPermissions,
  microphones,
  mimeExtMap,
  mimeType,
  getSupportedMimeTypes,
} from '@use/cast'

const camerasItems = computed(() => [
  {
    value: 'none',
    display: 'None',
  },
  ...cameras.value.map(i => ({
    value: i.deviceId,
    display: i.label,
  })),
])
const microphonesItems = computed(() => [
  {
    value: 'none',
    display: 'None',
  },
  ...microphones.value.map(i => ({
    value: i.deviceId,
    display: i.label,
  })),
])
const mimeTypeItems = getSupportedMimeTypes().map(mime => ({
  value: mime,
  display: mimeExtMap[mime].toUpperCase(),
}))
ensureDevicesListPermissions()
</script>

<template lang='pug'>
.flex.flex-wrap.gap-2
  select(v-model="currentCamera", title="Camera")
    option(v-for="camera in camerasItems" :key="camera")
  select(v-model="currentMic", title="Microphone")
    option(v-for="microphone in microphonesItems" :key="microphone")
  select(v-if="mimeTypeItems.length", v-model="mimeType", title="mimeType")
    option(v-for="mime in mimeTypeItems" :key="mime") {{mime}}
</template>