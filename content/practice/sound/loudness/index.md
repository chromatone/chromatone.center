---
title: Equal loudness contour
description: Build you own loudness contours
date: 2021-11-12
layout: app
cover: loudness.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const SoundLoudness = defineClientComponent(() => {
  return import('./SoundLoudness.vue')
})
</script>

<SoundLoudness />



> **Find your own equal loudness contour**  
> Place sine oscillators on the 2D-plane where vertical axis is the volume and horizontal is the frequency of the sounds being played. You can build up a curve for your absolute threshold of hearing, or explore your own feeling of really loud sounds. **Be careful clicking at the top of the graph!**
