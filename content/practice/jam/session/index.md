---
title: Jam session
description: A visual guide for collaborative music events
date: 2021-03-30
topContent: true
cover: cover.png
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const JamSession = defineClientComponent(() => {
  return import('./JamSession.vue')
})
</script>

<JamSession />
