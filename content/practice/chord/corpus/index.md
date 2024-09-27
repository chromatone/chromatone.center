---
title: Jazz chords corpus
description: Collection of jazz standards - digital Real Book online
date: 2014-09-27
layout: app
---


<script setup>
import { defineClientComponent } from 'vitepress'

const JazzCorpus = defineClientComponent(() => {
  return import('./JazzCorpus.vue')
})
</script>

<JazzCorpus  />