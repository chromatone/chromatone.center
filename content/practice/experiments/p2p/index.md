---
title: P2P connections
description: Trystero lab
date: 2014-07-30
layout: app
hidden: true
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Trystero = defineClientComponent(() => {
  return import('./Trystero.vue')
})
</script>

<Trystero/>
