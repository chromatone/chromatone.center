---
title: GPU shader
description: A MIDI reactive GLSL shader as a direct visual mathematical interpretation of musical notes.
date: 2023-06-18
---


<script setup>
import { defineClientComponent } from 'vitepress'

const ExpShader = defineClientComponent(() => {
  return import('./ExpShader.vue')
})

</script>

<ExpShader></ExpShader>

Let's use GPU power to visualize music notes!