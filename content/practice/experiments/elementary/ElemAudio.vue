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

  const synth = {

  }


  const control = reactive({
    gate: useClamp(1, 0, 1),
    volume: useClamp(.2, 0, 1),
    attack: useClamp(0.0001, 0, 6)
  })

  const voices = reactive(Array(numVoices).fill(true).map((_, i) => ({ gate: 0.0, freq: 440, key: `v${i}`, midi: 69 })))



  function synthVoice(voice) {
    return el.mul(0.2 * voice.gate, el.blepsaw(voice.freq))
  }

  const audio = computed(() => {
    // CONTROLS
    const ctrl = {}
    for (let c in control) {
      ctrl[c] = el.const({ key: `ctrl:${c}`, value: control[c] })
    }

    // OSC
    let env = el.adsr(ctrl.attack, .5, .3, .2, ctrl.gate)
    let beep = el.mul(env, el.blepsaw(440))

    // Noise
    let noise = el.mul(env, el.pinknoise())

    // Effects
    let summed = el.add(beep, el.mul(0.9, noise))
    let filtered = el.lowpass(el.add(400, el.mul(3000, env)), 1.4, summed)
    let delayed = el.mul(0.3, el.delay({ size: 44100 }, el.ms2samps(200), 0.2, filtered))
    let wetdry1 = el.add(filtered, delayed);
    // let reverbed = el.mul(0.3, el.convolve({ path: 'sample0' }, wetdry1))
    // let wetdry2 = el.add(wetdry1, reverbed)

    // INPUT
    // let input = el.mul(el.in({ key: 'in' }), 1.0)
    // let withInput = el.add(wetdry1, input)

    // OUTPUT
    let output = el.mul(wetdry1, ctrl.volume)

    return output
  })

  let nextVoice = 0;
  function startNote(num, velocity) {
    do {
      nextVoice++
      if (nextVoice >= voices.length) {
        nextVoice = 0
      }
    } while (voices[nextVoice].gate > 0)

    voices[nextVoice].gate = velocity / 127
    voices[nextVoice].freq = pitchFreq(num - 69)
    voices[nextVoice].midi = num
  }

  function stopNote(num) {
    voices.filter((v) => v.midi == num).map(v => v.gate = 0)
  }

  onMounted(async () => {

    const ctx = new AudioContext();
    const core = new WebRenderer();

    core.on('load', async function () {

      watch(voices, vcs => {
        let vs = vcs.map(el => synthVoice(el))
        let out = el.add(...vs)
        core.render(out, out)
      })

      watch(audio, a => {
        core.render(a, a)
      }, { immediate: true })

      setTimeout(() => {
        control.gate = 0
      }, 10)

    });

    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    node.connect(ctx.destination);

  })

  return {
    voices,
    control,
    startNote,
    stopNote
  }

}


const { control, voices, startNote, stopNote } = useElemSynth()

const { midi } = useMidi()

watch(() => midi.note, n => {
  if (n.velocity) {
    startNote(n.number, n.velocity)
  } else {
    stopNote(n.number)
  }
})

onKeyDown('a', () => { control.gate = 1 })
onKeyUp('a', () => { control.gate = 0 })


</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded
  .text-2xl.p-2 Elementary
  control-rotary(
    :step="0.001"
    v-model="control.volume"
    :max="1"
    param="Vol"
  )
  pre {{ control }}

  button.text-button(
    @mousedown.passive="control.gate=1"
    @mouseup.passive="control.gate=0"
    @touchstart.prevent.stop="control.gate=1"
    @touchend.prevent.stop="control.gate=0"
    @mouseleave="control.gate=0"
    ) PRESS TO PLAY A SOUND

  .text-xs(v-for="voice in voices" :key="voice") {{ voice }}

</template>