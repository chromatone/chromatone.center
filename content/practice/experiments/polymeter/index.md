---
title: Polymeter concentric circles
description: Cycles of measures of various number of beats
date: 2015-01-02
layout: app
cover: poly.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const PolyMeter = defineClientComponent(() => import('./PolyMeter.vue'))
</script>

<PolyMeter />
