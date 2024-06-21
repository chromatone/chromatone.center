---
title: Pendulums
description: Polyrhythmic explorations
date: 2024-06-17
layout: app
cover: cover.png
links: 
  - http://travisrtaylor.com/pendulum-explainer/
---


<script setup>
import { defineClientComponent } from 'vitepress'

const Pendulums = defineClientComponent(() => {
  return import('./Pendulums.vue')
})
</script>

<Pendulums/>
