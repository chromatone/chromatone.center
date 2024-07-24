---
title: Karplus–Strong synthesis
description: Pratical KS synth
date: 2024-06-01
cover: ksa.png
layout: app
---


<script setup>
import { defineClientComponent } from 'vitepress'

const StringSynth = defineClientComponent(() => {
  return import('./StringSynth.vue')
})
</script>

<StringSynth />