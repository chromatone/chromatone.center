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


<client-only>
<ElemSynth />
<!-- <ElemFFT class="border-b-2" :fft="FFT" :style="{ borderColor: color }" /> -->
<ElemScope />
<MidiKeys />
</client-only>

Fully operational polyphonic synthesizer with square/sawtooth oscillator, noise oscillator, Karplus-Strong string simulation, simple sampler and notable ping-pong delay as well as an SRVB reverb.