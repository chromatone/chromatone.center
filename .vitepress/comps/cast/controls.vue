<script setup lang="ts">
import { cast, showRecordingDialog } from "@use/cast";

const {
  currentCamera,
  recording,
  showAvatar,
  streamCamera,
  stopRecording,
  toggleAvatar,
} = cast;

function toggleRecording() {
  if (recording.value) stopRecording();
  else showRecordingDialog.value = true;
}
</script>

<template lang="pug">
.

      
</template>
