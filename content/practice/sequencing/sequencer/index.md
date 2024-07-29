---
title: Step sequencer
description: A simple tool to build up melodies and chord progressions
layout: app
date: 2021-08-19
cover: sequencer.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const StepSequencer = defineClientComponent(() => {
  return import('./StepSequencer.vue')
})
</script>

<StepSequencer style="position: sticky; top: 1em;" />
