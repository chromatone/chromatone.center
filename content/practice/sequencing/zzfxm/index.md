---
title: ZZFXM
desctiption: A music generator for use in tiny JavaScript productions
data: 2014-07-06
layout: app
cover: cover.png
links:
  - https://github.com/keithclark/ZzFXM/tree/master
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ZzFxm = defineClientComponent(() => {
  return import('./ZzFxm.vue')
})
</script>

<ZzFxm />


Work in progress. You can edit only the bpm value for now. Stay tuned!
