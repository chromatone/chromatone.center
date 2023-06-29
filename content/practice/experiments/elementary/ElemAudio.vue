<script setup>

import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchFreq, pitchColor } from '#/use/calculations';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';


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




  function genControl() {
    const control = {}
    params.forEach(p => {
      control[p.name] = useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max)
    })
    return control
  }

  const es = reactive({
    params,
    control: genControl(),
    ctrl: computed(() => {
      const ctrl = {}
      for (let c in es.control) {
        ctrl[c] = el.const({ key: `ctrl:${c}`, value: es.control[c] })
      }
      return ctrl
    }),
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
    }
  })

  onMounted(async () => {

    const ctx = new AudioContext();
    const core = new WebRenderer();
    core.on('load', async function () {

      watch(es, () => {
        console.log('reacted')
        const g = {
          voiceCount: el.sqrt(el.const({ key: 'voice-count', value: 1 / es.voices.length }))
        }

        g.synth = el.mul(
          es.ctrl.volume,
          el.mul(
            g.voiceCount,
            el.add(...es.voices.map(
              voice => {
                const v = {}
                for (let p in voice) {
                  v[p] = el.const({
                    key: `${voice.key}:${p}`,
                    value: voice[p]
                  })
                }

                v.env = el.mul(
                  v.vel,
                  el.adsr(
                    es.ctrl.attack,
                    es.ctrl.decay,
                    es.ctrl.sustain,
                    es.ctrl.release,
                    v.gate)
                )

                v.envOsc = el.mul(
                  v.env,
                  el.lowpass(
                    el.mul(4, v.freq),
                    1.1,
                    el.blepsaw(v.freq)))

                v.noise = el.mul(
                  v.env,
                  el.bandpass(v.freq, 50, el.noise()))

                v.summed = el.add(
                  el.mul(es.ctrl.osc1Gain, v.envOsc),
                  el.mul(es.ctrl.noiseGain, v.noise))

                return v.summed
              }))))

        function pingPong(x) {
          return Array(2).fill(null).map((n, i) => el.add(
            x,
            el.mul(
              0.3,
              el.delay(
                { size: 44100 },
                el.ms2samps(300 * (1 + i * .75)),
                .2,
                x))))
        }

        const [outR, outL] = pingPong(g.synth)

        core.render(outR, outL)
      })
    });

    const node = await core.initialize(ctx, {
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
    ) PRESS TO PLAY A SOUND

  .flex.flex-col.gap-1.font-mono
    .text-xs.flex(
      v-for="voice in es.voices" :key="voice"
      :style="{color:pitchColor(voice.midi-9), opacity: voice.gate ? 1:0.5}") 
      .p-1(
        v-for="(value,param) in voice" :key="param"

        ) {{ param }}:{{ value }}

</template>