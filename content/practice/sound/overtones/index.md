---
title: String overtones
description: String standing waves interactive visualization
date: 2021-08-12
layout: app
cover: overtones.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const SoundOvertones = defineClientComponent(() => {
  return import('./SoundOvertones.vue')
})
</script>

<SoundOvertones />
