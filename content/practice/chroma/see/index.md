---
title: See Chroma
description: Let's look at the relative amounts of all pitch class frequencies in any audio signal in real time.
cover: chroma.png
date: 2022-06-16
layout: app
---


<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaSee = defineClientComponent(() => {
  return import('./ChromaSee.vue')
})
</script>

<ChromaSee  />

---

Features:

- Drag over the scene horizontally to adjust circles blur
- Drag over the scene vertically to adjust circles size

Standalone visualizer at [see.chromatone.center](https://see.chromatone.center/)
