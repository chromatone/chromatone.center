---
title: Support
subtitle: Share links, contribute code or donate money to the open source development
date: 2021-05-30
---

<script setup> 
import mapGlobe from './globe.vue'
import routes from '~pages'
const shop = routes.find(page => page.path == '/shop/')
const cities = shop?.cities
const dots = cities.map(city=>city.coord)
</script>

<map-globe :dots="dots" />

Chromatone is an open source initiative made not to be a proprietary standard, but to become a wide spread language, used by musicians, visual artists along with music gear companies and app developers all over the world.
