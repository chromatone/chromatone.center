---
title: Tuner
description: Fast and precise instrument tuner web-app
layout: app
cover: tuner.svg
date: 2022-06-18
---

<script setup>
import { defineClientComponent } from 'vitepress'

const PitchTuner = defineClientComponent(() => {
  return import('./PitchTuner.vue')
})
</script>

<PitchTuner style="position: sticky; top: 0;"  />

<style scoped> 
.info {
  @apply bg-light-400 dark-bg-dark-400 z-10 max-w-65ch rounded-xl bg-op-60 dark-bg-op-60 backdrop-blur-md;
}
</style>

::: info

Start the tuner with the button at the center and produce the sound you want to find the pitch for. It may be your guitar, ukulele or any other string instrument. It may be your voice. The app will show the base frequency of the sound as well as the cents difference with the closes 12-TET note. The color of the background gradient corresponds to the exact frequency the app has detected.

:::