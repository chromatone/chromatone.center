---
title: Elementary synth
description: MIDI enabled synthesizer built with Elementary audio library
date: 2023-06-23
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
import { defineClientComponent } from 'vitepress'

const ElemAudio = defineClientComponent(() => {
  return import('../../../../audio/ElemAudio.vue')
})
</script>

<client-only>
<ElemAudio />
</client-only>

## Modular synth

Built with JS, but operated by WASM lib in a separate audio thread. Construction started around June 2023 and is ongoing till then. Supposed to be gradually substituting the sitewide Tone.js synth used by now.
