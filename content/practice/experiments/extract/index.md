---
title: Extract colors
description: Get prominent colors of any given picture. Locally.
date: 2021-10-18
layout: app
cover: extractcolors.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ExtractColors = defineClientComponent(() => {
  return import('./ExtractColors.vue')
})
</script>

<ExtractColors/>