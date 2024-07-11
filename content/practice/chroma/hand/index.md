---
title: Chromatic hands
description: A way to connect musical notes, colors and your own body and consciousness.
date: 2020-10-13
cover: hands.png
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChromaHand = defineClientComponent(() => {
  return import('./ChromaHand.vue')
})
</script>

<div class="flex">
<ChromaHand v-for="right in [false,true]" :style="{transform: right?`translateX(0px) scaleX(-100%) ` : ''}" :right="right" />
</div>
