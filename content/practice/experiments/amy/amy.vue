<script setup>
import {
  onKeyDown, onKeyUp, useStorage, onKeyStroke
} from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { context } from 'tone';
import { onMounted, ref } from 'vue';


var amy_started = false;
var web_audio_buffer = null;
var amy_play_message = null;
var amy_start_web = null;
var callback = null

onMounted(() => {
  // you can only start calling c++ functions once emscripten's "runtime" has started
  import('./amy.js').then(amy => {
    const { Module } = amy
    Module.onRuntimeInitialized = function () {
      web_audio_buffer = Module.cwrap(
        'web_audio_buffer', 'number', ['number', 'number']
      );
      amy_play_message = Module.cwrap(
        'amy_play_message', null, ['string']
      );
      amy_start_web = Module.cwrap(
        'amy_start_web', null, ['number']
      );
    }

    var dataHeap = null;
    var dataPtr = null;

    var data = new Float32Array();

    // l and r are float arrays for the left and right channels that need to be filled
    callback = function audioCallback(l) {

      // lazy loading of the audio buffer we use to talk to c++/emscripten
      if (dataHeap == null || dataHeap.length == 0) {
        data = new Float32Array(l.length);
        // Get data byte size, allocate memory on Emscripten heap, and get pointer
        var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
        dataPtr = Module._malloc(nDataBytes);

        // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
        dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
        dataHeap.set(new Uint8Array(data.buffer));
      }

      // now we actually call the C++
      web_audio_buffer(dataHeap.byteOffset, l.length);

      // turn the emscripten heap array to something we can work with in javascript
      // allocating on the audio thread, I know!
      var result = new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);

      // deinterleave the result
      for (let i = 0; i < l.length; i++) {
        l[i] = result[i];
      }
    }
  })
})


var audioRunning = false;
var scriptNode = null;
var source = null;
var audioCtx = null;

function setupAudio(fn) {
  // Create AudioContext and buffer source
  var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

  if (!AudioContext) {
    // Do whatever you want using the Web Audio API
    alert("Sorry, but the Web Audio API is not supported by your browser.");
  }
  audioCtx = new AudioContext({
    sampleRate: 48000
  });
  source = audioCtx.createBufferSource();

  // buff size, ins, outs
  scriptNode = audioCtx.createScriptProcessor(256, 0, 1);
  scriptNode.onaudioprocess = function (audioProcessingEvent) {
    fn(audioProcessingEvent.outputBuffer.getChannelData(0));
  };
}

function startAudio() {
  amy_start_web();
  amy_started = true;
  if (audioRunning) return;
  setupAudio(callback);
  scriptNode.connect(audioCtx.destination);
  source.start();
  audioRunning = true;
}

function stopAudio() {
  audioRunning = false;
  amy_started = false;
  audioCtx.suspend().then(function () {
    console.log('stopped')
  });

}
function reset() {
  if (amy_started) {
    var code = "S65";
    amy_play_message(code); //+"t"+millis());
    console.log('reset')
  }
}


const rngPatch = useClamp(useStorage('amy-patch', 248), 0, 1024)
const rngRatio = ref(1.0)

function piano_down(note) {
  startAudio()
  let mess = `v1l1w8n${note}p${rngPatch.value}I${rngRatio.value}`;
  if (amy_started) amy_play_message(mess);
}
function piano_up(note) {
  startAudio()
  let mess = "v1l0";
  if (amy_started) amy_play_message(mess);
}

const count = ref(0)

onKeyDown('a', () => {
  piano_down(80)
  count.value++
})

onKeyUp('a', () => {
  piano_up(80)
})

onKeyStroke('ArrowLeft', () => {
  rngPatch.value--
})

onKeyStroke('ArrowRight', () => {
  rngPatch.value++
})

</script>

<template lang='pug'>
.p-0
  .flex.flex-row.flex-wrap.gap-2.items-center.p-4
    .font-bold Patch
    button.i-la-arrow-left(@click="rngPatch--")
    input(
      type="range"
      v-model="rngPatch"
      min="0"
      max="1024"
    )
    button.i-la-arrow-right(@click="rngPatch++")
    .p-0  {{ rngPatch }}

  button.select-none.p-4.rounded-xl.bg-green-300.dark-bg-green-900.active-font-bold(
    @mousedown="piano_down(65);count++"
    @mouseup="piano_up(65)"
    ) PLAY!
  p {{ count }}
</template>