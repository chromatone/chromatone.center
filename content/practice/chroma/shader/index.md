---
title: GPU shader
description: A MIDI reactive GLSL shader as a direct visual mathematical interpretation of musical notes
date: 2021-04-22
---


<script setup>
import { defineClientComponent } from 'vitepress'

const ExpShader = defineClientComponent(() => {
  return import('./ExpShader.vue')
})

</script>

<ExpShader></ExpShader>
