---
title: Simplex
description: Simplex noise
date: 2021-10-18
layout: app
hidden: true
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Simplex = defineClientComponent(() => {
  return import('./Simplex.vue')
})
</script>

<Simplex/>
