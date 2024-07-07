---
title: Palette with feedback
description: More interesting and chaotic shader setup
date: 2021-04-22
cover: feedback.png
layout: app
---


<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaPaletteFeedback = defineClientComponent(() => {
  return import('./ChromaPaletteFeedback.vue')
})
</script>

<ChromaPaletteFeedback class="min-h-70svh h-80svh" />
