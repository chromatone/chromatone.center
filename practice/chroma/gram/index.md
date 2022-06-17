---
title: Сhromagram
subtitle: Visual representation of any audio chroma content
date: 2022-06-12
cover: chromagram.png
---

<script setup>
import chromaGram from './gram.vue'
</script>

<client-only >
  <chroma-gram class="mb-16" />
</client-only>

This app shows the [chromagram](https://en.wikipedia.org/wiki/Chroma_feature) or the [12 tone harmonic pitch class profile](https://en.wikipedia.org/wiki/Harmonic_pitch_class_profiles) of the incoming signal. It means is analyzes the frequency spectrum and sums them according to one of the 12 pitch classes. The relative power of every pitch class is plotted, showing the primary tones of the audio signal. Pure sine tone will give us one line filled and noise will make all the bands glow equally bright.

1. Drag the canvas graph to change the roll speed.
2. Press the <la-arrow-up /> (<la-arrow-left />) button to change the plot direction
3. Press the <la-expand /> button to expand the app to full screen

