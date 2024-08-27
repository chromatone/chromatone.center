---
title: Sensors
description: Device orientation and position
date: 2014-07-30
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Sensors = defineClientComponent(() => {
  return import('./Sensors.vue')
})
</script>

<Sensors/>
