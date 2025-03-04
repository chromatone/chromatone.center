---
title: AMY synth
description: Wasm synth playground
date: 2013-03-05
cover: dx7_algorithms.jpg
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const SynthAmy = defineClientComponent(() => {
  return import('./SynthAmy.vue')
})

import { onBeforeUnmount, onMounted } from "vue";
import { synthEnabled } from "#/use";

onMounted(() => synthEnabled.value = false)
onBeforeUnmount(() => synthEnabled.value = true)
</script>

<SynthAmy/>

<MidiKeys></MidiKeys>

## AMY Synth

### the Additive Music synthesizer librarY

Highly experimental. [Issue pending](https://github.com/bwhitman/amy/issues/35)

- Press `A` on your keyboard to play a note. Or push the PLAY button.
- Use <i class="p-3 i-la-arrow-left"></i> and <i class="p-3 i-la-arrow-right"></i> keys to browse patches

[AMY repository](https://github.com/bwhitman/amy)

AMY accepts commands in ASCII, like so:

# v0w4f440.0l0.9

Here's the full list:

| Code | Python      | Type-range        | Notes                                                                                                                                                                       |
| ---- | ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a    | amp         | float 0-1+        | use after a note on is triggered with velocity to adjust amplitude without re-triggering the note                                                                           |
| A    | bp0         | string            | in commas, like 100,0.5,150,0.25,200,0 -- envelope generator with alternating time(ms) and ratio. last pair triggers on note off                                            |
| B    | bp1         | string            | set the second breakpoint generator. see breakpoint 0                                                                                                                       |
| b    | feedback    | float 0-1         | use for the ALGO synthesis type in FM, or partial synthesis (for bandwidth) or for karplus-strong, or to indicate PCM looping (0 off, >0, on)                               |
| C    | bp2         | string            | 3rd breakpoint generator                                                                                                                                                    |
| d    | duty        | float 0.001-0.999 | duty cycle for pulse wave, default 0.5                                                                                                                                      |
| D    | debug       | uint, 2-4         | 2 shows queue sample, 3 shows oscillator data, 4 shows modified oscillator. will interrupt audio!                                                                           |
| f    | freq        | float             | frequency of oscillator                                                                                                                                                     |
| F    | filter_freq | float             | center frequency for biquad filter                                                                                                                                          |
| g    | mod_target  | uint mask         | Which parameter modulation/LFO controls. 1=amp, 2=duty, 4=freq, 8=filter freq, 16=resonance, 32=feedback. Can handle any combo, add them together                           |
| G    | filter_type | 0-3               | 0 = none (default.) 1 = low pass, 2 = band pass, 3 = hi pass.                                                                                                               |
| I    | ratio       | float             | for ALGO types, where the base note frequency controls the modulators, or for the ALGO base note and PARTIALS base note, where the ratio controls the speed of the playback |
| L    | mod_source  | 0 to OSCS-1       | Which oscillator is used as an modulation/LFO source for this oscillator. Source oscillator will be silent.                                                                 |
| l    | vel         | float 0-1+        | velocity - >0 to trigger note on, 0 to trigger note off. sets amplitude                                                                                                     |
| N    | latency_ms  | uint              | sets latency in ms. default 0                                                                                                                                               |
| n    | note        | uint 0-127        | midi note, sets frequency                                                                                                                                                   |
| o    | algorithm   | uint 1-32         | DX7 algorith to use for ALGO type                                                                                                                                           |
| O    | algo_source | string            | which oscillators to use for the algorithm. list of six, use -1 for not used, e.g 0,1,2,-1,-1-1                                                                             |
| p    | patch       | uint              | choose a preloaded PCM sample, partial patch or FM patch number for ALGO waveforms.                                                                                         |
| P    | phase       | float 0-1         | where in the oscillator's cycle to start sampling from (also works on the PCM buffer). default 0                                                                            |
| R    | resonance   | float             | q factor of biquad filter. in practice, 0-10.0. default 0.7                                                                                                                 |
| S    | reset       | uint              | resets given oscillator. set to > OSCS to reset all oscillators, gain and EQ                                                                                                |
| T    | bp0_target  | uint mask         | Which parameter bp0 controls. 1=amp, 2=duty, 4=freq, 8=filter freq, 16=resonance, 32=feedback (can be added together). Can add 64 for linear ramp, otherwise exponential    |
| t    | timestamp   | uint              | ms of expected playback since some fixed start point on your host. you should always give this if you can.                                                                  |
| v    | osc         | uint 0 to OSCS-1  | which oscillator to control                                                                                                                                                 |
| V    | volume      | float 0-10        | volume knob for entire synth, default 1.0                                                                                                                                   |
| w    | wave        | uint 0-11         | waveform: [0=SINE, PULSE, SAW_DOWN, SAW_UP, TRIANGLE, NOISE, KS, PCM, ALGO, PARTIAL, PARTIALS, OFF]. default: 0/SINE                                                        |
| W    | bp1_target  | uint mask         | see bp0_target                                                                                                                                                              |
| x    | eq_l        | float             | in dB, fc=800Hz amount, -15 to 15. 0 is off. default 0.                                                                                                                     |
| X    | bp2_target  | uint mask         | see bp0_target                                                                                                                                                              |
| y    | eq_m        | float             | in dB, fc=2500Hz amount, -15 to 15. 0 is off. default 0.                                                                                                                    |
| z    | eq_h        | float             | in dB, fc=7500Hz amount, -15 to 15. 0 is off. default 0.                                                                                                                    |
