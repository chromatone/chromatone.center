---
title: Chroma Touch
description: Intuitive and performant WebMIDI intstrument
date: 2021-04-20
layout: app
cover: cover.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaTouch = defineClientComponent(() => {
  return import('./ChromaTouch.vue')
})
</script>

<ChromaTouch class=" w-full max-w-full h-100vh"  />
