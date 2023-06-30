---
title: Wheels
description: Clockwise motion, but with fixed hands
date: 1987-06-30
---

<script setup>
import { defineClientComponent } from 'vitepress'
const RhythmWheels = defineClientComponent(() => {
  return import('./RhythmWheels.vue')
})
</script>

<RhythmWheels />
