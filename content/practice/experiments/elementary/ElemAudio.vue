<script setup>

import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchFreq } from '#/use';

//@ts-ignore
// import IR from './BatteryPowell.wav'
import { onKeyDown, onKeyUp } from '@vueuse/core';
import { useClamp } from '@vueuse/math';

function useElemSynth({
  numVoices = 8
} = {}) {

  const es = reactive({
    control: {
      gate: useClamp(1, 0, 1),
      volume: useClamp(.2, 0, 1),
      attack: useClamp(0.001, 0, 6)
    },
    nextVoice: 0,
    voices: Array(numVoices).fill(true).map((_, i) => ({ gate: 0.0, freq: 440, key: `v${i}`, midi: 69, vel: 0 })),
    synthVoice(voice) {
      const ctrl = {}
      for (let c in es.control) {
        ctrl[c] = el.const({ key: `ctrl:${c}`, value: es.control[c] })
      }

      // OSC
      // let env = el.adsr(ctrl.attack, .5, .3, .3, voice.gate)
      // let beep = el.mul(env, el.blepsquare(voice.freq))

      // // Noise
      // let noise = el.mul(env, el.pinknoise())

      // // Effects
      // let summed = el.add(beep, el.mul(0.9, noise))
      // let filtered = el.lowpass(el.add(400, el.mul(3000, env)), 1.4, summed)
      // let delayed = el.mul(0.7, el.delay({ size: 44100 }, el.ms2samps(200), 0.2, filtered))
      // let wetdry1 = el.add(filtered, delayed);
      // let reverbed = el.mul(0.3, el.convolve({ path: 'sample0' }, wetdry1))
      // let wetdry2 = el.add(wetdry1, reverbed)

      // INPUT
      // let input = el.mul(el.in({ key: 'in' }), 1.0)
      // let withInput = el.add(wetdry1, input)

      // OUTPUT
      // let output = el.mul(wetdry1, ctrl.volume)
      const env = el.adsr({ key: `${voice.key}:env` }, 100, .3, .4, 8, voice.gate)
      const osc = el.blepsquare({ key: `${voice.key}:osc` }, voice.freq)
      const envOsc = el.mul(env, osc)
      const noise = el.mul(env, el.noise())

      let summed = el.add(el.mul(0.5, envOsc), el.mul(.3, noise))

      const output = el.mul(summed)

      return output
    },
    startNote(num, velocity) {
      while (es.voices[es.nextVoice].gate == 1) {
        es.nextVoice++
        if (es.nextVoice >= es.voices.length) {
          es.nextVoice = 0
        }
      }
      const voice = {
        gate: 1,
        vel: velocity / 127,
        freq: pitchFreq(num - 69),
        midi: num
      }
      es.voices[es.nextVoice] = voice
    },
    stopNote(num) {
      es.voices.filter((v) => v.midi == num).map(v => v.gate = 0)
    }
  })

  onMounted(async () => {

    const ctx = new AudioContext();
    const core = new WebRenderer();

    core.on('load', async function () {

    });

    watch(es, () => {
      let vs = es.voices.map(el => es.synthVoice(el))
      let out = el.add(...vs)
      core.render(out, out)
    })

    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    node.connect(ctx.destination);

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
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded
  .text-2xl.p-2 Elementary
  control-rotary(
    :step="0.001"
    v-model="es.control.volume"
    :max="1"
    param="Vol"
  )
  pre {{ es.control }}

  button.text-button(
    @mousedown.passive="es.control.gate=1"
    @mouseup.passive="es.control.gate=0"
    @touchstart.prevent.stop="es.control.gate=1"
    @touchend.prevent.stop="es.control.gate=0"
    @mouseleave="es.control.gate=0"
    ) PRESS TO PLAY A SOUND

  .text-xs(v-for="voice in es.voices" :key="voice") {{ voice }}

</template>