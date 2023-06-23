
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { onMounted, watch, computed, ref, reactive } from 'vue'
import { useMidi } from '#/use/midi'
import { pitchFreq } from '#/use';
import { watchEffect } from 'vue';


export function useElemSynth() {

  const elemOptions = reactive({
    volume: 1
  })

  onMounted(async () => {

    const ctx = new AudioContext();
    const core = new WebRenderer();

    core.on('load', function () {
      console.log('loaded')
      // core.render(el.cycle(220), el.cycle(110));

    });

    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    node.connect(ctx.destination);

    watchEffect(() => {

      const list = Object.keys(midi.activeNotes).map(n => ({ gain: midi.activeNotes[n], freq: pitchFreq(Number(n) - 69) }))

      if (list.length > 0) {

        let sum = el.add(...list.map(v => el.mul(v.gain / list.length, el.cycle(v.freq))))

        const result = el.mul(sum, elemOptions.volume)

        core.render(result, result);
      } else {
        core.render(el.const({ key: 'silence', value: 0 }))
      }
    })
  })

  const { midi } = useMidi()

  return {
    elemOptions
  }

}


