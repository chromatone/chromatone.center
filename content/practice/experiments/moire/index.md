---
title: Moire
description: Lines and intersections experiment
date: 1024-08-28
layout: app
cover: cover.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Moire = defineClientComponent(() => {
  return import('./Moire.vue')
})
</script>

<Moire/>
