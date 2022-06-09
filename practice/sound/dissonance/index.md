---
title: Sensory dissonance curve
subtitle: The harmonic relations of notes

date: 2021-08-22
cover: dissonance.svg
links:
  - url: https://sethares.engr.wisc.edu/consemi.html
    title: Calculations of the dissonant curves
  - url: https://www.juliabloggers.com/consonant-triads/
    title: Python formulas for dissonance curves
---

<script setup>
import dissonance from './dissonance.vue'
</script>

<client-only>
  <dissonance />
</client-only>

A simple curve for two sine waves is readily established and then we can calculate and explore sensory dissonance curves for complex sounds as the sum of interactions between their partials.

Try dragging the note to hear the exact interval. Toggle the plain sine and rich sawtooth waveforms. Compare the feeling of consonance and the dips in the curve yourself.

[More info in the Theory research](../../../theory/intervals/dissonance/index.md).