---
title: Real book online
description: Collection of jazz standards, digital corpus of chord progressions
date: 2014-09-27
layout: app
cover: real-book.png
---


<script setup>
import { defineClientComponent } from 'vitepress'

const RealBook = defineClientComponent(() => {
  return import('./RealBook.vue')
})
</script>

<RealBook  />