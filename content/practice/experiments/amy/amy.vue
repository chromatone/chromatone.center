<script setup>
import {
  onKeyDown, onKeyUp, useStorage, onKeyStroke
} from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { ref } from 'vue';


var web_audio_buffer = null;
var amy_play_message = null;
var amy_start_web = null;
var startDate = new Date();
var startTime = startDate.getTime();
var callback = null

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

  // you can only start calling c++ functions once emscripten's "runtime" has started

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
      let dataPtr = Module._malloc(nDataBytes);

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

const started = ref(true)
const buttonText = ref('')

var audioRunning = false;
var scriptNode = null;
var source = null;
var audioCtx = null;


function setupAudio(fn) {
  var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

  if (!AudioContext) {
    alert("Sorry, but the Web Audio API is not supported by your browser.");
  }

  audioCtx = new AudioContext();
  source = audioCtx.createBufferSource();

  scriptNode = audioCtx.createScriptProcessor(256, 0, 1);
  scriptNode.onaudioprocess = function (audioProcessingEvent) {
    fn(audioProcessingEvent.outputBuffer.getChannelData(0));
  };
}
function millis() {
  var date_now = new Date();
  var time_now = date_now.getTime();
  var time_diff = time_now - startTime;
  return time_diff;
  //var seconds_elapsed = Math.floor ( time_diff  );
}
function reset() {
  if (amy_started) {
    var code = "S65";
    amy_play_message(code); //+"t"+millis());
  }
}

function send(osc) {
  if (amy_started) {
    if (osc < 0) {
      amy_play_message('w7p2n60');
    } else {

      amy_play_message("v" + osc + 'w7p6');//+"t"+millis());
    }
  }
}
var amy_started = false;

function startAudio() {

  amy_start_web();
  amy_started = true;

  if (audioRunning) return;
  setupAudio(callback);
  scriptNode.connect(audioCtx.destination);
  source.start();
  audioRunning = true;
  started.value = true
}

function stopAudio() {
  audioRunning = false;
  amy_started = false;
  audioCtx.suspend().then(function () {
    started.value = false
  });

}

const rngPatch = useClamp(useStorage('amy-patch', 180), 0, 1024)
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

  button.p-4.rounded-xl.bg-green-300.dark-bg-green-900.active-font-bold(
    @mousedown="piano_down(65);count++"
    @mouseup="piano_up(65)"
    ) PLAY
  p {{ count }}
</template>