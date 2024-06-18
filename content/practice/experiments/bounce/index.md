---
title: Bouncing sinusoids
description: Polyrhythmic explorations
date: 2024-06-18
layout: app
cover: cover.png
links: 
  - http://travisrtaylor.com/pendulum-explainer/
---


<script setup>
import { defineClientComponent } from 'vitepress'

const Bounce = defineClientComponent(() => {
  return import('./Bounce.vue')
})
</script>

<Bounce/>
