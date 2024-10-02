---
title: Sensory dissonance curve
description: The harmonic relations of notes
layout: app
date: 2021-08-22
cover: dissonance.svg
links:
  - url: https://sethares.engr.wisc.edu/consemi.html
    title: Calculations of the dissonant curves
  - url: https://www.juliabloggers.com/consonant-triads/
    title: Python formulas for dissonance curves
---

<script setup>
import { defineClientComponent } from 'vitepress'

const SoundDissonance = defineClientComponent(() => {
  return import('./SoundDissonance.vue')
})
</script>


<client-only >

  <SoundDissonance style="position: sticky; top: 0;" />

</client-only >


::: info

A simple curve for two sine waves is readily established and then we can calculate and explore sensory dissonance curves for complex sounds as the sum of interactions between their partials.

Try dragging the note to hear the exact interval. Toggle the plain sine and rich sawtooth waveforms. Compare the feeling of consonance and the dips in the curve yourself.

[More info in the Theory research](../../../theory/intervals/dissonance/index.md).

:::