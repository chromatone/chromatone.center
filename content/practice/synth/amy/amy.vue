<script setup>
import {
  onKeyDown, onKeyUp, useStorage, onKeyStroke
} from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { context } from 'tone';
import { onMounted, reactive, computed, watch } from 'vue';
//@ts-expect-error
import AMYCodes from '#/db/amy-codes.yaml'
import { midi } from '#/use/midi'

var amy_started = false;
var amy_audio_buffer = null;
var amy_play_message = null;
var amy_start_web = null;
var callback = null

const amy = reactive({
  started: false,
  codes: AMYCodes,

  message: computed(() => {
    const arr = []
    for (let p in amy.knobs) {
      arr.push(`${p}${amy.knobs[p]}`)
    }
    arr.push('A0,0.2,150,1,250,0T59')

    return arr.join('')
  }),
  waveforms: ['SINE', 'PULSE', 'SAW_DOWN', 'SAW_UP', 'TRI', 'NOISE', 'KS', 'PCM', 'ALGO', 'PARTIAL', 'PARTIALS'],

  knobs: {
    p: useClamp(useStorage('amy-patch', 248), 0, 1024),
    w: useClamp(useStorage('amy-waveform', 7), 0, 11),
    V: useClamp(useStorage('amy-volume', 1), 0, 10),
    d: useClamp(useStorage('amy-duty', 0.5), 0.001, 0.999),
    o: useClamp(useStorage('amy-algo', 1), 1, 32),
    b: useClamp(useStorage('amy-feedback', 0), 0, 1),
  },
  note: useClamp(60, 10, 127),


  history: []
})

function useAMY() {

  watch(() => midi.note, n => {
    amy.play(n.number, n.velocity / 127)
  })

  watch(() => amy.message, m => {
    amy_play_message(m)
    amy.history.unshift(m)
  })

  onKeyDown('a', () => { amy.play(amy.note, 1) })
  onKeyUp('a', () => { amy.play(amy.note, 0) })

  onKeyStroke('ArrowLeft', () => { amy.knobs.patch-- })
  onKeyStroke('ArrowRight', () => { amy.knobs.patch++ })

  onKeyStroke('ArrowUp', (e) => { e.preventDefault(); amy.note++ })
  onKeyStroke('ArrowDown', (e) => { e.preventDefault(); amy.note-- })

  onMounted(() => {
    import('./amy.js').then(amy => {
      const { Module } = amy
      Module.onRuntimeInitialized = function () {
        amy_audio_buffer = Module.cwrap(
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

        amy_audio_buffer(dataHeap.byteOffset, l.length);
        var result = new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);

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

    var AudioContext = window.AudioContext
      //@ts-expect-error
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

    if (audioRunning) return;
    amy_start_web?.();
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

  amy.play = (note, velocity = 0) => {
    if (!amy_started) startAudio()
    let osc = `v${note * 20}`
    if (velocity > 0) {
      let setup = osc + amy.message
      amy_play_message(setup)
      amy.history.unshift(setup)
    }

    let msg = osc + `n${note}l${velocity.toFixed(2)}`
    amy.history.unshift(msg)
    amy_play_message(msg)
  }

  amy.reset = (n = 100000) => {
    let msg = `S${n}`
    amy.history.unshift(msg)
    amy_play_message(msg)
  }

  return amy
}


useAMY()

</script>

<template lang='pug'>
.p-2.rounded-xl.border-1.m-2.select-none.flex.flex-wrap.gap-2
  transition-group(name="fade")
    control-rotary(
      :min="0"
      :max="11"
      param="Wave"
      v-model="amy.knobs.w"
      :fixed="0"
      :unit="amy.waveforms[amy.knobs.w]"
    )
    control-rotary(
      :min="1"
      :max="1024"
      param="Patch"
      v-model="amy.knobs.p"
      v-if="amy.knobs.w > 6"
      :fixed="0"
    )
    control-rotary(
      :min="0.001"
      :max=".999"
      param="Duty"
      :step="0.01"
      v-if="amy.knobs.w == 1"
      v-model="amy.knobs.d"
      :fixed="2"
    )
    control-rotary(
      :min="1"
      :max="32"
      param="ALGO"
      v-if="amy.knobs.w == 8"
      v-model="amy.knobs.o"
      :fixed="0"
    )
    control-rotary(
      :min="0"
      :max="1"
      param="Feedback"
      v-model="amy.knobs.b"
      v-if="amy.knobs.w>5"
      :fixed="1"
      :step="0.01"
    )
    control-rotary(
      :min="0"
      :max="10"
      param="Volume"
      v-model="amy.knobs.V"
      :fixed="1"
      :step="0.01"
    )
    .flex-auto
    button.text-button(@click="amy.reset()") RESET
.p-2.rounded-xl.border-1.m-2.select-none.flex.flex-wrap.gap-4
  control-rotary(
    :min="1"
    :max="127"
    param="Note"
    v-model="amy.note"
    :fixed="0"
    unit="MIDI"
    )
  button.flex.items-center.gap-4.select-none.p-4.rounded-xl.bg-green-300.dark-bg-green-900.active-font-bold(
    @mousedown.prevent.stop="amy.play(amy.note,1)"
    @touchstart.prevent.stop="amy.play(amy.note,1)"
    @mouseup.prevent.stop="amy.play(amy.note,0)"
    @touchend.prevent.stop="amy.play(amy.note,0)"
    )
    .i-la-play.text-4xl

.p-4.flex.items-center.font-mono {{ amy.message }}

.top-16.right-4.p-4.w-80.max-h-80vh.overflow-hidden.flex.flex-col.opacity-30.pointer-events-none.font-mono.text-sm.fixed
  .font-bold.border-b-2 {{ amy.message }}
  transition-group(name="fade")
    .p-0(v-for="rec in amy.history" :key="rec") {{ rec }}
//- .flex.flex-wrap.gap-4
//-   .text-2xl Floats
//-   .p-2.flex(v-for="(knob,key) in amy.knobs" :key="key") 
//-     .text-xl {{ key }}: {{ knob.name}}
//-       control-knob(
//-         :param="knob.name"
//-         :min="knob.min"
//-         :max="knob.max"
//-         v-model="knob.current.value"
//-         :step="0.01"
//-       )
//- pre {{ amy.knobs }}
//TODO - string, uint, mask
</template>