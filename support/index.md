---
title: Support
subtitle: Share links, contribute code or donate money to the open source development
list: support
tags: main
date: 2021-05-30
---

<script setup> 
import {useData} from 'vitepress'
const {theme} = useData()
const all = theme.value.pages.all
const shop = all.find(page => page.link == '/shop/')
const cities = shop.data.cities
const dots = cities.map(city=>city.coord)
</script>

<map-globe :dots="dots" />

Chromatone is an open source initiative made not to be a proprietary standard, but to become a wide spread language, used by musicians, visual artists along with music gear companies and app developers all over the world.
