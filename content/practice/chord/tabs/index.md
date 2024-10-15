---
title: Tabs
description: Guitar and ukulele tabs for any chord in existence
date: 2021-08-03
cover: tabs.png
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChordTabs = defineClientComponent(() => {
  return import('./ChordTabs.vue')
})
</script>

<ChordTabs />
