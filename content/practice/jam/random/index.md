---
title: Random Jam
description: A simple randomizer for basic jam parameters - BPM, Tonic and Scale.
date: 2024-04-30
topContent: true
cover: jam.png
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const JamRandom = defineClientComponent(() => {
  return import('./JamRandom.vue')
})
</script>

<JamRandom />
