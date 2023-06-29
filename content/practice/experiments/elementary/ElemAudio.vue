<script setup>

import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchFreq, pitchColor } from '#/use/calculations';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { watchEffect } from 'vue';

import { pingPong } from './toolbox';


function genControl(ps) {
  const control = {}
  ps.forEach(p => {
    control[p.name] = useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max)
  })
  // ps.reduce((obj, p) => ({ ...obj, [p.name]: useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max) }), {})

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
    voices: Array(numVoices).fill(true).map((_, i) => ({ gate: 0.0, freq: 440, key: `v${i}`, midi: 69, vel: 0 })),
    startNote(num, velocity) {
      do {
        es.nextVoice++
        if (es.nextVoice >= es.voices.length) {
          es.nextVoice = 0
          es.overflow++
        }
        if (es.overflow > 3) break;
      } while (es.voices[es.nextVoice].gate == 1)
      es.overflow = 0
      Object.assign(es.voices[es.nextVoice], {
        gate: 1,
        vel: velocity / 127,
        freq: pitchFreq(num - 69),
        midi: num
      })

    },
    stopNote(num) {
      es.voices.filter((v) => v.midi == num).forEach(v => Object.assign(v, { gate: 0 })
      )
    },
    ctrl: computed(() => {
      const ctrl = {}
      for (let c in es.control) {
        ctrl[c] = el.const({ key: `ctrl:${c}`, value: es.control[c] })
      }
      return ctrl
    }),
    cv: computed(() =>
      es.voices.map((vc, i) => {
        const v = {}
        for (let p in vc) {
          v[p] = el.const({ key: `${vc.key}:${p}`, value: vc[p] })
        }
        return v
      })
    ),
    synth(voices = es.voices) {
      return el.mul(
        es.ctrl.volume,
        el.mul(
          el.sqrt(
            el.const({
              key: 'voice-count',
              value: 1 / voices.length
            })),
          el.add(...voices.map(
            (_, i) => {
              const v = {}

              v.env = el.mul(
                es.cv[i].vel,
                el.adsr(
                  es.ctrl.attack,
                  es.ctrl.decay,
                  es.ctrl.sustain,
                  es.ctrl.release,
                  es.cv[i].gate)
              )

              v.envOsc = el.mul(
                v.env,
                el.lowpass(
                  el.mul(4, es.cv[i].freq),
                  1.1,
                  el.blepsaw(es.cv[i].freq)))

              v.noise = el.mul(
                v.env,
                el.bandpass(es.cv[i].freq, 50, el.noise()))

              v.summed = el.add(
                el.mul(es.ctrl.osc1Gain, v.envOsc),
                el.mul(es.ctrl.noiseGain, v.noise))

              return v.summed
            }))))
    },
    async init() {
      const ctx = new AudioContext();
      const core = new WebRenderer({

      });

      core.on('load', async function () {

        watchEffect(() => {
          console.log('reacted')

          const [outR, outL] = pingPong(es.synth())

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
  if (n.velocity) {
    es.startNote(n.number, n.velocity)
  } else {
    es.stopNote(n.number)
  }
})

</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded.flex.flex-col.gap-4
  .text-2xl.p-2 Elementary 
  .flex.is-group.p-2.gap-2
    control-rotary(
      v-for="param in es.params" :key="param.name"
      :step="param.step"
      v-model="es.control[param.name]"
      :min="param.min"
      :max="param.max"
      :param="param.name"
      )

  button.text-button.text-2xl(
    @mousedown.passive="es.startNote(60, 120)"
    @mouseup.passive="es.stopNote(60)"
    @touchstart.prevent.stop="es.startNote(60, 120)"
    @touchend.prevent.stop="es.stopNote(60)"
    @mouseleave="es.stopNote(60)"
    ) PRESS TO PLAY A NOTE

  .flex.flex-col.gap-1.font-mono
    .text-xs.flex(
      v-for="voice in es.voices" :key="voice"
      :style="{color:pitchColor(voice.midi-9), opacity: voice.gate ? 1:0.5}") 
      .p-1(
        v-for="(value,param) in voice" :key="param"

        ) {{ param }}:{{ value }}

</template>