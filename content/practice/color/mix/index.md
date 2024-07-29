---
title: MIDI color mixing
description: Full screen colors react to midi notes to explore the cross stimulation of the brain
date: 2011-04-05
cover: milad-fakurian.jpg
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ColorMix = defineClientComponent(() => {
  return import('./ColorMix.vue')
})
</script>

<ColorMix style="position: sticky; top: 0;" />


::: info

Press any key on your keyboard to hear a note and to see the corresponding color. Go fullscreen with the button at the top right.

:::