---
title: Monochord
description: Virtual string for frequency and length ratio explorations
layout: app
date: 2021-09-12
cover: monochord.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const MonoChord = defineClientComponent(() => {
  return import('./MonoChord.vue')
})
</script>

<MonoChord />

Drag the divider to explore the string divisions of a monochord, just like Pythagoras did.
