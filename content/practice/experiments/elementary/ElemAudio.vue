<script setup>
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchColor } from '#/use/calculations';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';


import { midiFrequency, pingPong } from './toolbox';


function genControl(ps) {
  const control = {}
  ps.forEach(p => {
    control[p.name] = useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max)
  })
  return control
}

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

  const es = reactive({
    params,
    control: genControl(params),
    nextVoice: 0,
    overflow: 0,
    voices: Array(numVoices).fill(true).map((_, i) => ({ key: `v${i}`, gate: 0.0, midi: 69, vel: 0 })),
    cycleNote(num, velocity) {
      if (velocity) {
        do {
          es.nextVoice++
          if (es.nextVoice >= es.voices.length) {
            es.nextVoice = 0
            es.overflow++
          }
          if (es.overflow > 3) break;
        } while (es.voices[es.nextVoice].gate == 1)
        es.overflow = 0
        es.voices[es.nextVoice].gate = 1;
        es.voices[es.nextVoice].vel = velocity / 127;
        es.voices[es.nextVoice].midi = num;

      } else {
        es.voices.forEach(v => {
          if (v.midi == num) {
            v.gate = 0
          }
        }
        )
      }
    },
    stopAll(num) {
      es.voices.forEach(v => Object.assign(v, { gate: 0 })
      )
    },
    ctrl: computed(() => {
      const ctrl = {}
      for (let c in es.control) {
        ctrl[c] = el.const({ key: `ctrl:${c}`, value: es.control[c] })
      }
      return ctrl
    }),
    synth: (voices = es.voices) =>
      el.mul(
        es.ctrl.volume,
        el.mul(
          el.sqrt(
            el.const({
              key: 'voice-count',
              value: 1 / voices.length
            })),
          el.add(...voices.map(
            (voice, i) => {
              let frequency = midiFrequency(voice.midi, voice.key)

              let envelope = el.mul(
                el.const({ key: `${voice.key}:vel`, value: voice.vel }),
                el.adsr(
                  es.ctrl.attack,
                  es.ctrl.decay,
                  es.ctrl.sustain,
                  es.ctrl.release,
                  el.const({ key: `${voice.key}:gate`, value: voice.gate })))

              let osc = el.mul(
                es.ctrl.osc1Gain,
                envelope,
                el.lowpass(
                  el.mul(4, frequency),
                  1.1,
                  el.blepsaw(frequency)))

              let noise = el.mul(
                es.ctrl.noiseGain,
                envelope,
                el.bandpass(frequency, 50, el.noise()))

              return el.add(osc, noise)
            })))),

    async init() {
      const ctx = new AudioContext();
      const core = new WebRenderer({

      });

      core.on('load', async function () {

        watch(es, () => {
          console.log('reacted')

          const [outR, outL] = pingPong(es.synth(es.voices))

          core.render(outR, outL)
        })
      });

      const node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      });

      node.connect(ctx.destination);
    }
  })

  onMounted(async () => {
    es.init()
  })

  return es
}

const es = useElemSynth()

const { midi } = useMidi()

watch(() => midi.note, n => {
  es.cycleNote(n.number, n.velocity)
})

</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary 
  .flex.flex-wrap.is-group.p-2.gap-2
    control-rotary(
      v-for="param in es.params" :key="param.name"
      :step="param.step"
      v-model="es.control[param.name]"
      :min="param.min"
      :max="param.max"
      :param="param.name"
      )

  .flex.gap-4
    button.text-button.text-2xl.flex-1(
      @mousedown.passive="es.cycleNote(60, 120)"
      @mouseup.passive="es.cycleNote(60)"
      @touchstart.prevent.stop="es.cycleNote(60, 120)"
      @touchend.prevent.stop="es.cycleNote(60)"
      @mouseleave="es.cycleNote(60)"
      ) PRESS TO PLAY A NOTE
    button.text-button.text-2xl(@click="es.stopAll()") STOP ALL

  .flex.flex-col.gap-1.font-mono
    .text-xs.flex(
      v-for="voice in es.voices" :key="voice"
      :style="{color:pitchColor(voice.midi-9), opacity: voice.gate ? 1:0.5}") 
      .p-1(
        v-for="(value,param) in voice" :key="param"

        ) {{ param }}:{{ value }}

</template>