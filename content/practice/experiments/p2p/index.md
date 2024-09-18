---
title: P2P connections
description: GUN database experiments
date: 2014-07-30
layout: app
cover: p2p.png
---

<script setup>
import { defineClientComponent } from 'vitepress'

const GunP2p = defineClientComponent(() => {
  return import('./GunP2p.vue')
})
</script>

<GunP2p/>

<MidiKeys class="mt-8" :height="200" />
