---
title: Elementary playground
description: Place to polish Elementary.audio scripting
date: 2014-08-21
layout: app
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ElemPlayground = defineClientComponent(() => import('./ElemPlayground.vue'))
</script>

<ElemPlayground/>
