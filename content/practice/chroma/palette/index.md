---
title: Palette
description: A MIDI reactive GLSL shader as a direct visual mathematical interpretation of musical notes
date: 2021-04-22
cover: shader.png
layout: app
topContent: true
links:
  - https://github.com/kongxiaojian123/vue-glsl#readme
  - https://registry.khronos.org/OpenGL-Refpages/gl4/index.php
  - https://iquilezles.org/articles/palettes/
  - https://thebookofshaders.com/
  - https://github.com/jamieowen/glsl-blend
  - https://www.shadertoy.com/view/4tSGWV
  - https://www.shadertoy.com/view/mtyGWy
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaPalette = defineClientComponent(() => {
  return import('./ChromaPalette.vue')
})
</script>

<ChromaPalette style="position: sticky; top: 0;"/>

::: info

Chroma Palette is an immersive digital artwork that leverages Denis Starov's Chromatone system to translate the aural into the visual. Incorporating a microphone to capture live ambient audio, the installation analyzes the sounds and assigns one of twelve unique colors to each of the twelve distinct pitch classes, effectively rendering a visual representation of the sound's frequency content on a screen. This innovative approach not only allows for the visualization of music but also creates a multisensory feedback loop, engaging both sight and hearing in a unified perceptual experience.

The artwork operates within the broader context of the Chromatone music web-apps ecosystem, which is designed to facilitate the study and appreciation of music through visual means. By interacting with Pitch Palette, participants influence the soundscape, thereby altering the visual output in real-time. This participatory element is key, transforming viewers into an integral part of the installation and inviting them to explore the symbiotic relationship between different senses and the environment. Through Pitch Palette, Starov extends an invitation to journey into a synesthetic space where sound and color intersect and are experienced in unison.

:::