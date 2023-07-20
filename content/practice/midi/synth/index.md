---
title: Elementary audio
description: New audio lib experiment
date: 2023-06-23
cover: lockup.svg

---

<script setup>
import { defineClientComponent } from 'vitepress'

const ElemAudio = defineClientComponent(() => {
  return import('./audio/ElemAudio.vue')
})
</script>

<ElemAudio />

## Links

- https://www.elementary.audio/docs/guides/Understanding_Keys
- https://github.com/elemaudio/web-examples
- https://github.com/bgins/coincident-spectra/blob/main/src/lib/audio/audio.ts
- https://github.com/teetow/elementary_grid
  
## Resources

- https://signalsmith-audio.co.uk/writing/2021/lets-write-a-reverb/
- https://ccrma.stanford.edu/~jos/
- https://jackschaedler.github.io/circles-sines-signals/
- https://www.soundonsound.com/synthesizers/synth-secrets
- https://www.theaudioprogrammer.com/
- https://www.dsprelated.com/
- https://www.earlevel.com/main/
- http://www.willpirkle.com/
- https://www.hackaudio.com/

## Snippets

### Mic input

When you use el.in() you have to be specific about which channel you want to tap, i.e. el.in({channel: 0}), but then you need to make sure that your WebAudioNode running elementary's engine actually has input signals. So you would need to call core.initialize to declare that input channels are expected, and then you would need to actually connect your web audio input nodes to the node returned by core.initialize. Does that make sense?

```js
let node = await core.initialize(audioContext, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      inputChannelCount: [1], // Notice, it's a mono input
      outputChannelCount: [2],
    }, 8);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      let micStream = await navigator.mediaDevices.getUserMedia({audio: true});
      let streamSource = audioContext.createMediaStreamSource(micStream);
      streamSource.connect(node);
    }
```

### Skew by [upheaver](https://discord.com/channels/826071713426178078/834787928688689172/1123676571279048875)

Sharing a useful snippet. JUCE's logskew function in Typescript, if anyone wants to scale their parameter values (for example convert 0-1 range to 20-20000 hz in a non linear way) :

```js
const clamp = ( min: number, max: number, num: number ) => {
    return Math.min(Math.max(num, min), max);
}

const skew = ( min: number, max: number, centerPoint: number ) => {
    return Math.log(0.5) / Math.log((centerPoint - min) / (max - min));
}

const logskew = ( a: number, b: number, time: number, centerPoint: number) => {
    const proportion = clamp(0, 1, time);
    const sk = skew(a, b, centerPoint);
    const v = Math.exp (Math.log (proportion) / sk);
    return a + (b - a) * v;
}

console.log(logskew( 20, 20000, 0.5, 1000)) // will output 1000
```

## Metronome

[Yea long story short](https://discord.com/channels/826071713426178078/834787928688689172/1127958693695205387) I think metro was maybe not a great idea and it's worth considering to deprecate it. More effective in my opinion is to take el.time() which monotonically increases, counting the number of elapsed samples, and derive a quarter-note phasor from el.time(). (From bpm you calculate seconds per beat, from which you calculate samples per beat, which you can use to convert el.time() into a phasor running at exactly quarter-note rate). Then of course if you want to change bpm you just change the numbers in your calculation but it will all be perfectly time-synced because it's derived from the actual time signal. And then you can turn your quarter-note phasor into a pulse train with el.le(phasor, 0.5)
