---
title: Tonal array
description: Harmonic table note layout - symmetrical hexagonal pattern of interval sequences
cover: array.png
date: 2022-02-01
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const TonalArray = defineClientComponent(() => {
  return import('./TonalArray.vue')
})
</script>

<TonalArray/>

[wiki](https://en.wikipedia.org/wiki/Harmonic_table_note_layout)
