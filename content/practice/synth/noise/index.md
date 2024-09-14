---
title: Noise lab
description: As white light is the combination of all colors, the white noise is the combination of all possible notes
layout: app
date: 2021-06-22
cover: noise.jpg
---

<script setup>
import { defineClientComponent } from 'vitepress'

const SynthNoise = defineClientComponent(() => {
  return import('./SynthNoise.vue')
})
</script>

<SynthNoise />

## Noise generation tool

A simple tool to generate some noise. Let's look at the possibilities.

1. The **noise generator** section
   1. You can start the noise by tapping the **NOISE** button at the top left. There's a latch in the bottom of this button to fix the noise playing. Click it again to unlatch the sound playing. The other way is to press **A** – the sound will play as long as you hold it.
   2. The **DRY** slider determines the volume of the initial noise source.
   3. Choose the type of the noise (its 'color') between Brown, Pink and White.
      1. [White noise](https://en.wikipedia.org/wiki/White_noise) is a random signal having equal intensity at different frequencies, giving it a constant power spectral density.
      2. [Pink noise](https://en.wikipedia.org/wiki/Pink_noise) or 1⁄f noise is a signal or process with a frequency spectrum such that the power spectral density (power per frequency interval) is inversely proportional to the frequency of the signal. In pink noise, each octave interval (halving or doubling in frequency) carries an equal amount of noise energy. Pink noise is one of the most common signals in biological systems.
      3. The spectral density of the [Brown noise](https://en.wikipedia.org/wiki/Brownian_noise) is inversely proportional to f^2, meaning it has higher intensity at lower frequencies, even more so than pink noise. It decreases in intensity by 6 dB per octave (20 dB per decade) and, when heard, has a "damped" or "soft" quality compared to white and pink noise.
   4. Next is the **ADSR** controls group: drag **ATTACK**, **DECAY**, **SUSTAIN** and **RELEASE** sliders to adjust the signal envelope.
2. **Auto-filter** section. Press or latch the **FILTER** button to engage the filter. Change the FREQUENCY, OCTAVES and Q-FACTOR of the filter. Choose [LP](https://en.wikipedia.org/wiki/Low-pass_filter) (Low-Pass), [HP](https://en.wikipedia.org/wiki/High-pass_filter) (High-pass) or [BP](https://en.wikipedia.org/wiki/Band-pass_filter) (Band-pass) filter type. Then goes the **PLAY** button to turn on the LFO of the filter. **LFO** and **DEPTH** sliders set the swing of the filter and next you have the choise of the Low Frequency Oscillator.
3. A [**Bitcrusher**](https://en.wikipedia.org/wiki/Bitcrusher) is an audio effect that produces distortion by reducing of the resolution or bandwidth of digital audio data. The resulting quantization noise may produce a "warmer" sound impression, or a harsh one, depending on the amount of reduction. Set the volume of the bus, the **BITS** resolution and the **WET** parameter of how much of the signal should come through.
4. **Auto-panner** section makes the sound move from left to right with another LFO. Turn on the PAN to turn on the effect. Latch the PLAY button to make the panning move. **LFO** sets the frequency of the movement, **DEPTH** sets the amplitude of it.
