---
title: Draw on a canvas
description: Atrament experiment
date: 2024-08-21
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Atrament = defineClientComponent(() => {
  return import('./Atrament.vue')
})
</script>

<Atrament/>
