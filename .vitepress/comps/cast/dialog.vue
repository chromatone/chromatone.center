<script setup>
import { useVModel } from "@vueuse/core";
import { nextTick } from "vue";
import { getFilename, mimeType, recordCamera, cast, recordingName } from "@use/cast";

const props = defineProps({
  modelValue: {
    default: false,
  },
});

const emit = defineEmits([]);

const value = useVModel(props, "modelValue", emit);
const { startRecording } = cast;
function close() {
  value.value = false;
}
async function start() {
  close();
  await nextTick();
  startRecording({
    mimeType: mimeType.value,
  });
}
</script>

<template lang="pug">
.px-6.py-4.recording-dialog.flex.flex-col.gap-2
  .flex.gap-2.text-xl
    carbon-video.my-auto.
      Recording
      
  .grid.grid-cols-2.gap-4
    .flex.flex-col.gap-2.py-2
      .form-text
        label(for="title") Recording Name
        input.bg-transparent.text-current(v-model="recordingName", name="title", type="text", placeholder="Enter the title...")
        .text-xs.w-full.opacity-50.py-2
          div
            | This will be used in the output filename that might
            br
            | help you better organize your recording chips.
      .form-check
        input(v-model="recordCamera", name="record-camera", type="checkbox")
        label(for="record-camera", @click="recordCamera = !recordCamera") Record camera separately
      .text-xs.w-full.opacity-50
        .mt-2.opacity-50.
          
          Enumerated filenames
          
        .font-mono.
          
          {{ getFilename('screen', mimeType) }}
          
        .font-mono(v-if="recordCamera").
          
          {{ getFilename('camera', mimeType) }}
          
    cast-devices
      
      
  .flex.my-1
    button.cancel(@click="close").
      
      Cancel
      
    .flex-auto
      button(@click="start").
        
        Start
        
</template>
