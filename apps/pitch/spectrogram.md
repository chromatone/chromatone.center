---
title: Spectrogram
subtitle: 2.5D representation on frequency domain in time
tags: pitch
date: 2021-05-01
cover: apps/spectrogram.png
usefulLinks:
  - https://codepen.io/hvianna/pen/ZEKWWJb
  - https://www.npmjs.com/package/audiomotion-analyzer
  - https://github.com/ListeningToWaves/SpectrogramTesting/blob/master/src/components/spectrogram.js
---

<client-only>
  <pitch-spectrogram class="mb-16" />
</client-only>

> <la-info-circle /> Drag to the left to speed up the roll speed.

The colorful spectrogram is a powerful tool for visual audio analysis. Each particular frequency in the spectrum gets it's own position on the vertical axis along with the corresponding Chromatone color. The pitch spectrum is continous and the graph shows all the partials in a rather high resolution. The colors of the lines help differentiate pitches and overtones in any incoming audio signal. The quality of analysis is based primarily on the quality of the signal – thus a good microphone is recommended for best experience.