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

  callback = function audioCallback(l) {
    if (dataHeap == null || dataHeap.length == 0) {
      data = new Float32Array(l.length);
      var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
      dataPtr = Module._malloc(nDataBytes);
      dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
      dataHeap.set(new Uint8Array(data.buffer));
    }

    web_audio_buffer(dataHeap.byteOffset, l.length);
    var result = new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);

    for (let i = 0; i < l.length; i++) {
      l[i] = result[i];
    }
  }
})

var audioRunning = false;
var scriptNode = null;
var source = null;
var audioCtx = null;
let sts = 0

function setupAudio(fn) {

  var AudioContext = window.AudioContext
    || window.webkitAudioContext
    || false;

  if (!AudioContext) {
    console.error("No Audio")
    return
  }
  audioCtx = new AudioContext({
    sampleRate: 48000
  });
  source = audioCtx.createBufferSource();
  scriptNode = audioCtx.createScriptProcessor(256, 0, 1);
  scriptNode.onaudioprocess = function (audioProcessingEvent) {
    fn(audioProcessingEvent.outputBuffer.getChannelData(0));
  };
}

function startAudio() {
  amy_start_web();

  if (audioRunning) return;
  setupAudio(callback);
  scriptNode.connect(audioCtx.destination);
  source.start();
  audioRunning = true;
  // setTimeout(() => {
  //   console.log('started')
  //   amy_play_message("v54l1w8n70p30")
  // }, 50)
  amy_started = true;
}

function stopAudio() {
  audioRunning = false;
  amy_started = false;
  audioCtx.suspend().then(function () {
    console.log('stopped')
  });
}


const rngPatch = useClamp(useStorage('amy-patch', 248), 0, 1024)
const rngRatio = ref(1.0)

function piano_down(note) {
  startAudio()
  // if (!amy_started) return console.log('not yet started')
  let mess = `v1l1w8n${note}p${rngPatch.value}I${rngRatio.value}`;
  amy_play_message(mess)
}

function piano_up(note) {
  startAudio()
  // if (!amy_started) return console.log('not yet started')
  let mess = "v1l0";
  amy_play_message(mess)
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
.p-0.select-none
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
    @mousedown.prevent.stop="piano_down(65);count++"
    @touchstart.prevent.stop="piano_down(65);count++"
    @mouseup.prevent.stop="piano_up(65)"
    @touchend.prevent.stop="piano_up(65)"
    )
    .i-la-play.text-4xl
  p {{ count }}
</template>