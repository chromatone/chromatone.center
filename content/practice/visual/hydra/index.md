---
title: Hydra synth
description: Experiment with visual synth
cover: cover.png
layout: app
date: 2020-02-02
links:
  - https://github.com/hydra-synth/hydra-synth
  - https://github.com/hydra-synth/hydra
  - https://github.com/hydra-synth/hydra-examples
---

<script setup>
import { defineClientComponent } from 'vitepress'

const HydraSynth = defineClientComponent(() => {
  return import('./HydraSynth.vue')
})
</script>

<HydraSynth/>

## Hydra

Set of tools for livecoding networked visuals. Inspired by analog modular synthesizers, these tools are an exploration into using streaming over the web for routing video sources and outputs in realtime.

Hydra uses multiple framebuffers to allow dynamically mixing, compositing, and collaborating between connected browser-visual-streams. Coordinate and color transforms can be applied to each output via chained functions.

https://hydra.ojack.xyz
