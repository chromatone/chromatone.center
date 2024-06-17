---
title: Number Sequences
description: Playing with mathematical wonders
date: 2024-06-17
layout: app
cover: cover.png
links: 
  - https://www.npmjs.com/package/jisg
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Numbers = defineClientComponent(() => {
  return import('./Numbers.vue')
})
</script>

<Numbers/>
