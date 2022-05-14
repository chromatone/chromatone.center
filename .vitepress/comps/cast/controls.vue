<script setup lang="ts">
import { cast, showRecordingDialog } from '@use/cast'

const {
  currentCamera,
  recording,
  showAvatar,
  streamCamera,
  stopRecording,
  toggleAvatar,
} = cast

function toggleRecording() {
  if (recording.value)
    stopRecording()
  else
    showRecordingDialog.value = true
}

</script>

<template lang="pug">
button.icon-btn(
  v-if="currentCamera !== 'none'", 
  :class="{ 'text-green-500': Boolean(showAvatar && streamCamera) }", 
  title="Show camera view", 
  @click="toggleAvatar"
  )
  carbon-user-avatar
    
button.icon-btn(
  :class="{ 'text-red-500': recording }", 
  title="Recording", 
  @click="toggleRecording"
  )
  carbon-stop-outline(v-if="recording")
  carbon-video(v-else)
      
cast-devices
</template>