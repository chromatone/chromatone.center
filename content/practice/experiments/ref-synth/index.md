---
title: Elementary Refs
description: Implementing the new rendering technique for Elementary 3
date: 2010-11-07
layout: app
links:
  - https://www.elementary.audio/docs/guides/using_refs
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ElemRef = defineClientComponent(() => {
  return import('./ElemRef.vue')
})
</script>

<ElemRef />
