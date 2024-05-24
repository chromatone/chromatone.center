---
title: Physical sequencer
description: 2D rigid body physics simulator
date: 2024-05-24
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Matter = defineClientComponent(() => {
  return import('./Matter.vue')
})
</script>

<Matter/>
