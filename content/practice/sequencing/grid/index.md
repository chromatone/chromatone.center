---
title: Chroma Grid
description: Compose phrases and motifs in flexible grids
layout: app
date: 2021-11-02
cover: grid.png
todo:
  - MIDI out channels
  - midi out on-off
  - solo
  - mutes
  - synth
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaGrids = defineClientComponent(() => {
  return import('./ChromaGrids.vue')
})
</script>

<client-only >
  
  <ChromaGrids/>
  <div class="flex flex-wrap">
  <control-scale style="flex: 1 1 20px" />
  <state-transport style="flex: 1 1 20px" />
</div>
</client-only>
