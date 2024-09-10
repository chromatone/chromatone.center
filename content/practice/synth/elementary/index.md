---
title: Elementary synth
description: MIDI enabled synthesizer built with Elementary audio library
date: 2024-06-23
cover: lockup.svg
layout: app
links:
  - https://www.elementary.audio/docs/guides/Understanding_Keys
  - https://www.elementary.audio/docs/reference/Math
  - https://github.com/elemaudio/web-examples
  - https://github.com/bgins/coincident-spectra/blob/main/src/lib/audio/audio.ts
  - https://github.com/teetow/elementary_grid
  - https://www.nickwritesablog.com/drum-synthesis-in-javascript/
  - https://github.com/elemaudio/web-examples/blob/master/planets/app.js
  - https://github.com/teetow/elementary_grid/blob/master/src/lib/useSynth.tsx
---


<script setup>
import { meters, midiColor } from '#/use'
</script>

<client-only>



<div class="relative bg-gray-500 bg-op-30 backdrop-blur-sm w-full sticky top-0 z-100 touch-action-none pointer-events-none">
<ElemScope 
class="absolute top-0 w-full " 
v-for="(_,v) in 12" 
:key="v"
:color="midiColor(meters[`synth-voice-${v}-midi`]?.max,undefined,meters[`synth-voice-${v}-gate`]?.max,)"
:name="`synth-voice-${v}`" />

<ElemFFT class="border-b-2 mt-16"  />
</div>
<ElemSynth />
<MidiKeys />
</client-only>

Fully operational polyphonic synthesizer with square/sawtooth oscillator, noise oscillator, Karplus-Strong string simulation, simple sampler and notable ping-pong delay as well as an SRVB reverb.