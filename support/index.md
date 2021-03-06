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

If you're a designer, JS developer, audio analysis library or know how else the site may be better - [Contribute](./contribute/index.md) code to our open GitHub repository.

If you find Chromatone system helpful in your music learning or teaching process, please share love with a [Donation](./donate/index.md) to the site author.

We have a subreddit to hang around and an Instagram account to tag in your posts. And it's important to let more people join the growing community of visual musicians. So [follow us](./follow/index.md) and spread the word about Chromatone through your social media and beyond. 