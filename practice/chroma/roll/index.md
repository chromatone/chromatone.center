---
title: Roll
subtitle: Visual representation of any audio chroma content
date: 2022-06-12
cover: chroma-roll.png
---

<script setup>
import chromaRoll from './roll.vue'
</script>

<client-only >
  <chroma-roll class="mb-16" />
</client-only>

This app shows the chroma content of the incoming signal. It means is analyzes the frequency spectrum and sums them according to one of the 12 pitch classes. The relative power of every pitch class is plotted, showing the primary tones of the audio signal. Pure sine tone will give us one line filled and noise will make all the bands glow equally bright.

1. Drag the canvas graph to change the roll speed.
2. Press the <la-arrow-up /> (<la-arrow-left />) button to change the plot direction
3. Press the <la-expand /> button to expand the app to full screen
