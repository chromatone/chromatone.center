---
title: Spectrogram
description: 2.5D representation on frequency domain in time
layout: app
date: 2022-06-16
cover: spectrogram.png
usefulLinks:
  - https://codepen.io/hvianna/pen/ZEKWWJb
  - https://www.npmjs.com/package/audiomotion-analyzer
  - https://github.com/ListeningToWaves/SpectrogramTesting/blob/master/src/components/spectrogram.js
---


<client-only>
  <PitchSpectrogram class="mb-8" />
</client-only>

The colorful spectrogram is a powerful tool for visual audio analysis. Each particular frequency in the spectrum gets it's own position on the vertical axis along with the corresponding Chromatone color. The pitch spectrum is continous and the graph shows all the partials in a rather high resolution. The colors of the lines help differentiate pitches and overtones in any incoming audio signal. The quality of analysis is based primarily on the quality of the signal – thus a good microphone is recommended for best experience.

## How to use the spectrogram

1. Drag across <i class="p-3 mr-1 i-la-hand-rock"></i> the spectrogram top change the roll speed. The actual setting is at the top-left corner.
2. Press the <i class="p-3 mr-1 i-la-expand"></i> icon at the bottom-right corner make the spectrogram go full screen. Very useful mode for deep explorations and teaching.
3. You can pause <i class="p-3 mr-1 i-la-pause"></i> and resume <i class="p-3 mr-1 i-la-play"></i> the roll either by clicking anywhere at the spectrogram or by pressing the `Spacebar` button on your keyboard. Useful when comparing two or more sound spectrums – record a sound spectrum on the roll, then pause it, take another instrument and record another. The roll can fit up to 10 segments or even more.
4. Clear the canvas with the <i class="p-3 mr-1 i-la-trash-alt"></i> button at the top-right corner or by pressing the `Enter` button on your keyboard.
5. POW control changes the Power to which we raise the value of each band. It accentuates louder frequencies and dampens noise.
6. OFFSET control is for tuning the values before the raising to the power. It can help adjust the brightness and sensitivity of the spectroscope.
7. Right click the small video to open the spectrogram in Picture-In-Picture mode. You may need to press play in the floating window to see the spectrogram running.
