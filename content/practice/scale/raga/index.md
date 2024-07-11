---
title: Indian ragas
description: Interactive scaleset used in Melakarta raga
date: 2022-07-11
cover: saubhagya-gandharv.jpg
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ScaleRaga = defineClientComponent(() => {
  return import('./ScaleRaga.vue')
})
</script>

<ScaleRaga />