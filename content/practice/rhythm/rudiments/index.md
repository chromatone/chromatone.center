---
title: Drum rudiments
description: Interactive database of all 40 stardard drum rudiments
date: 2003-09-07
cover: daniel-shapiro.jpg
layout: app
---
<script setup>
import { defineClientComponent } from 'vitepress'

const RhythmDrumRudiments = defineClientComponent(() => {
  return import('./RhythmDrumRudiments.vue')
})
</script>

<RhythmDrumRudiments   />
