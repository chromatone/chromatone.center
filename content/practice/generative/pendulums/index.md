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

const MultiPendulums = defineClientComponent(() => {
  return import('./MultiPendulums.vue')
})
</script>

<MultiPendulums/>
