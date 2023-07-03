<script setup>
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchColor } from '#/use/calculations';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';

import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

import { midiFrequency, pingPong } from './toolbox';

function useElemSynth({
  numVoices = 8,
  params = [
    { name: 'volume', value: .2, min: 0, max: 1, step: .01 },
    { name: 'osc1Gain', value: .5, min: 0, max: 1, step: .01 },
    { name: 'noiseGain', value: .5, min: 0, max: 1, step: .01 },
    { name: 'attack', value: .01, min: 0.001, max: 5, step: .01 },
    { name: 'decay', value: .01, min: 0.001, max: 4, step: .01 },
    { name: 'sustain', value: .5, min: 0, max: 1, step: .01 },
    { name: 'release', value: .01, min: 0.001, max: 10, step: .01 },
  ]
} = {}) {

  const analyser = reactive({
    osc: [0, 0],
    oscPoints: computed(() => analyser.osc.map((v, i) => [i, v * 25].join(',')).join(' '))
  })

  const ui = reactive({
    controls: ((ps) => {
      const control = {}
      ps.forEach(p => {
        control[p.name] = useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max)
      })
      return control
    })(params),
  })

  const synth = reactive({
    params,
    voices: Array(numVoices).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })),
    nextVoice: 0,
    overflow: 0,
    ctrl: computed(() => {
      const ctrl = {}
      for (let c in ui.controls) {
        ctrl[c] = el.smooth(el.tau2pole(0.01), el.const({ key: `ctrl:${c}`, value: ui.controls[c] }))
      }
      return ctrl
    }),
    cycleNote(num, velocity) {
      if (velocity) {
        do {
          synth.nextVoice++
          if (synth.nextVoice >= synth.voices.length) {
            synth.nextVoice = 0
            synth.overflow++
          }
          if (synth.overflow > 3) break;
        } while (synth.voices[synth.nextVoice].gate == 1)
        synth.overflow = 0
        synth.voices[synth.nextVoice]['gate'] = 1;
        synth.voices[synth.nextVoice]['midi'] = num;
        synth.voices[synth.nextVoice]['vel'] = velocity / 127;
      } else {
        synth.voices.forEach(v => {
          if (v.midi == num) {
            v.gate = 0
          }
        })
      }
    },
    stopAll(num) {
      synth.voices.forEach(v => v.gate = 0)
    },
    voice(voice) {
      let frequency = midiFrequency(voice.midi, voice.key)
      let envelope = el.mul(
        el.const({ key: `${voice.key}:vel`, value: voice.vel }),
        el.adsr(
          synth.ctrl.attack,
          synth.ctrl.decay,
          synth.ctrl.sustain,
          synth.ctrl.release,
          el.const({ key: `${voice.key}:gate`, value: voice.gate })))

      let osc = el.mul(
        synth.ctrl.osc1Gain,
        envelope,
        el.lowpass(
          el.mul(4, frequency),
          1.1,
          el.blepsaw(frequency)))

      let noise = el.mul(
        synth.ctrl.noiseGain,
        envelope,
        el.bandpass(frequency, 50, el.noise()))

      return el.add(osc, noise)
    },
    poly: (voices = synth.voices) =>
      el.scope({ name: 'osc', size: 512 }, el.mul(
        synth.ctrl.volume,
        el.mul(
          el.sqrt(
            el.const({
              key: 'voice-count',
              value: 1 / voices.length
            })),
          el.add(...voices.map(voice => synth.voice(voice)))))),

    async init() {
      const ctx = new (AudioContext || webkitAudioContext)();
      const core = new WebRenderer()

      core.on('load', async function () {
        core.on('scope', (e) => {
          if (e?.source == 'osc') {
            let arr = [...e?.data[0].values()]
            // let zeroCross = arr.findIndex((v, i) => v * arr[i + 1] < 0)
            analyser.osc = arr //.slice(zeroCross)
          }
        })

        function render() {
          console.log('rendering')
          if (ctx.state === 'suspended') {
            ctx.resume()
          }
          const stereo = pingPong(synth.poly(synth.voices)).map(v => el.tanh(v))
          core.render(...stereo)
        }

        watch(synth, render)
      })

      const node = await core.initialize(ctx, {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      })

      node.connect(ctx.destination)

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let streamSource = ctx.createMediaStreamSource(micStream);
        streamSource.connect(node);
      }
    }
  })

  onMounted(async () => {
    synth.init()
  })

  return { synth, analyser, ui }
}

const { synth, analyser, ui } = useElemSynth()

const { midi } = useMidi()

watch(() => midi.note, playMidiNote)

function playMidiNote(n) {
  synth.cycleNote(n.number, n.velocity)
}

</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary 
  //- .text-xs.pre {{ analyser.osc }}
  svg(ref="svgElem" viewBox="0 -25 500 50")
    polyline(
      stroke-width="2"
      stroke="currentColor"
      fill="transparent"
      :points="analyser.oscPoints"
      )
  .flex.flex-wrap.is-group.p-2.gap-2
    control-rotary(
      v-for="param in synth.params" :key="param.name"
      :step="param.step"
      v-model="ui.controls[param.name]"
      :min="param.min"
      :max="param.max"
      :param="param.name"
      )

  .flex.gap-4
    button.text-button.text-2xl.flex-1(
      @mousedown.passive="synth.cycleNote(60, 120)"
      @mouseup.passive="synth.cycleNote(60)"
      @touchstart.prevent.stop="synth.cycleNote(60, 120)"
      @touchend.prevent.stop="synth.cycleNote(60)"
      @mouseleave="synth.cycleNote(60)"
      ) PRESS TO PLAY A NOTE
    button.text-button.text-2xl(@click="synth.stopAll()") STOP ALL

  .flex.flex-col.gap-1.font-mono
    .text-xs.flex(
      v-for="voice in synth.voices" :key="voice"
      :style="{color:pitchColor(voice.midi-9), opacity: voice.gate ? 1:0.5}") 
      .p-1(
        v-for="(value,param) in voice" :key="param"

        ) {{ param }}:{{ value }}

</template>