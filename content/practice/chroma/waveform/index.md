---
title: Waveform
description: Visualization of the sum waveform of any chroma note combination
layout: app
date: 2021-04-12
cover: chromaform.png
---


Choose any of the notes to see the wavefrom of their combination.

<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaForm = defineClientComponent(() => {
  return import('./ChromaForm.vue')
})
</script>

<ChromaForm />
