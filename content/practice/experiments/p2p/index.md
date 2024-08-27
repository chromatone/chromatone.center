---
title: P2P connections
description: GUN database experiments
date: 2014-07-30
layout: app
hidden: true
---

<script setup>
import { defineClientComponent } from 'vitepress'

const GunP2p = defineClientComponent(() => {
  return import('./GunP2p.vue')
})
</script>

<GunP2p/>
