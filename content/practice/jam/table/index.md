---
title: Jam table
description: A visual guide for jamming to be placed on the table and accessible from both sides
date: 2023-01-01
cover: cover.png
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const JamTable = defineClientComponent(() => {
  return import('./JamTable.vue')
})
</script>

<JamTable />
