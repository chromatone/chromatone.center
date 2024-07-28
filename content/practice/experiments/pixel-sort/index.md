---
title: Pixel sort
description: Count and sort pixels into 12 hue buckets of 5 shades.
date: 2020-10-18
layout: app
cover: cover.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const PixelSort = defineClientComponent(() => {
  return import('./PixelSort.vue')
})
</script>

<PixelSort/>
