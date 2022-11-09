<script setup>
import {
  fileNames,
  mimeType,
  recordCamera,
  cast,
  recordingName,
  showRecordingDialog,
} from "#/use/cast";

import { useWindowSize } from '@vueuse/core'
import { drawingEnabled } from '#/theme/components/draw/draw'

const {
  streamCamera,
  showAvatar,
  recordingTime,
  currentCamera,
  toggleAvatar,
  toggleRecording,
  recording,
  startRecording,
} = cast;

const options = ref();

import { useRecorder } from "#/use/recorder";

const { record, recording: audioRecording, toggled, duration } = useRecorder();

const { width, height } = useWindowSize()

</script>

<template lang="pug">
.flex.flex-col.gap-2.w-full

  .flex.flex-wrap.gap-2
    .is-group.flex.flex-wrap
      button.flex-button(
        @click="record.start()" 
        v-if="!audioRecording"
        v-tooltip.top="'Start audio recording'"
        ) 
        mdi-checkbox-blank-circle-outline
        .m-0 Record audio
      button.flex-button.text-red-500(@click="record.stop()" v-else)  
        mdi-checkbox-blank-circle.animate-pulse
        .p-1 {{ (duration / 1000).toFixed() }} s
      button.flex-button(
        :class="{ 'text-red-500': recording }", 
        title="Recording", 
        @click="toggleRecording"
        v-tooltip.top="'Start screen recording'"
        )
        carbon-stop-outline(v-if="recording")
        carbon-video(v-else)
        .m-0 Record screen {{ width }}x{{ height }}
        .p-1(v-if="recordingTime") {{ (recordingTime / 1000).toFixed() }}s
    .is-group.flex.flex-wrap
      button.flex-button(
        v-if="currentCamera !== 'none'", 
        :class="{ 'text-green-500': Boolean(showAvatar && streamCamera) }", 
        title="Show camera view", 
        @click="toggleAvatar"
        v-tooltip.top="'Enable circular camera avatar'"
        )
        carbon-user-avatar
        .ml-0 Camera avatar
      button.flex-button(
        @click="options = !options"
        aria-label="Screencast options"
        v-tooltip.top="'Open screencast options'"
        )
        la-cog
        .ml-0 Settings
  .flex.gap-2(v-if="options")
    .flex.flex-col.gap-2.py-2(style="flex: 1 1 100px")
      .form-check
        input.mr-2(v-model="recordCamera", name="record-camera", type="checkbox")
        label(for="record-camera", @click="recordCamera = !recordCamera") Record camera separately
      .form-text
        input.bg-transparent.text-current(
          v-model="recordingName", 
          name="title", 
          type="text", 
          placeholder="Enter recording title"
          )

      .text-xs.w-full.opacity-50
        .mt-2.opacity-50 Resulting filenames

        .font-mono {{ fileNames.screen }}

        .font-mono(v-if="recordCamera") {{ fileNames.camera }}

    cast-devices(style="flex: 10 1 300px")

          
</template>
