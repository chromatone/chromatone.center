---
title: Table
description: Every possible note in a huge expandable table
layout: app
cover: table.png
date: 2022-06-02
---


<script setup>
import { defineClientComponent } from 'vitepress'

const PitchTable = defineClientComponent(() => {
  return import('./PitchTable.vue')
})
</script>

<PitchTable  />