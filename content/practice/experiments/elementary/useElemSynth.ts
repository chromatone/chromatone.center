
import { NodeRepr_t, el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { master, pitchFreq } from '#/use';
import { watchEffect } from 'vue';
//@ts-ignore
import IR from './BatteryPowell.wav'
import { onKeyDown, onKeyUp } from '@vueuse/core';

console.log(IR)

export function useElemSynth() {

  const { midi } = useMidi()

  const ctrl = reactive({
    gate: 1,
    volume: 0.1
  })

  const voices = reactive(Array(8).fill(true).map((_, i) => ({ gate: 0.0, freq: 440, key: `v${i}`, midi: 69 })))

  let nextVoice = 0;

  function synthVoice(voice) {
    return el.mul(0.2 * voice.gate, el.blepsaw(voice.freq))
  }

  const audio = computed(() => {
    // OPTIONS
    const gate = el.const({ key: 'beep', value: ctrl.gate })
    const volume = el.const({ key: 'volume', value: ctrl.volume })

    // OSC
    let env = el.adsr(.001, .5, .3, .2, gate)
    let beep = el.mul(env, el.blepsaw(440))

    // Noise
    let noise = el.mul(env, el.pinknoise())

    // Effects
    let summed = el.add(beep, el.mul(0.9, noise))
    let filtered = el.lowpass(el.add(400, el.mul(3000, env)), 1.4, summed)
    let delayed = el.mul(0.3, el.delay({ size: 44100 }, el.ms2samps(200), 0.2, filtered))
    let wetdry1 = el.add(filtered, delayed)
    // let reverbed = el.mul(0.3, el.convolve({ path: 'sample0' }, wetdry1))
    // let wetdry2 = el.add(wetdry1, reverbed)

    // OUTPUT
    let output = el.mul(wetdry1, volume)
    return output
  })

  onMounted(async () => {

    const ctx = new AudioContext();
    const core = new WebRenderer();

    core.on('load', async function () {
      console.log('loaded')
      // let file = await fetch(IR)
      // let buff = await file.arrayBuffer()
      // let sampleBuffer = await ctx.decodeAudioData(buff);

      // core.updateVirtualFileSystem({
      //   'sample0': sampleBuffer.getChannelData(0),
      // });

      watch(audio, a => {
        core.render(a, a)
      }, { immediate: true })

      setTimeout(() => {
        ctrl.gate = 0
      }, 10)

    });

    watch(() => midi.note, n => {
      const freq = pitchFreq(n.number - 69)
      if (n.velocity) {
        voices[nextVoice].gate = n.velocity / 127
        voices[nextVoice].freq = freq
        voices[nextVoice].midi = n.number
        if (++nextVoice >= voices.length) {
          nextVoice -= voices.length
        }
      } else {
        voices.filter((v) => v.midi == n.number).map(v => v.gate = 0)
      }
      let vcs = voices.map(el => synthVoice(el))

      let out = el.add(...vcs)

      core.render(out, out)

    })

    onKeyDown('a', () => { ctrl.gate = 1 })
    onKeyUp('a', () => { ctrl.gate = 0 })

    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    node.connect(ctx.destination);

  })

  return {
    voices,
    ctrl
  }

}


