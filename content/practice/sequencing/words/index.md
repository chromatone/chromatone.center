---
title: Words sequencing
desctiption: Decomposing words into riffs and melodies
data: 2024-06-21
layout: app
links:
  - https://github.com/words/similar-english-words?tab=readme-ov-file
  - https://github.com/words/an-array-of-english-words?tab=readme-ov-file
---


<script setup>
import { defineClientComponent } from 'vitepress'

const Words = defineClientComponent(() => {
  return import('./Words.vue')
})
</script>

<Words/>