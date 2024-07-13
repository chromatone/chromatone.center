---
title: All scales list
description: The most full list of subsets of 12 chromatic notes
date: 2024-07-13
layout: app
---


<script setup>
import { defineClientComponent } from 'vitepress'

const ScaleList = defineClientComponent(() => {
  return import('./ScaleList.vue')
})
</script>

<ScaleList />
