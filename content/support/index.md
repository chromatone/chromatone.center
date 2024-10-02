---
title: Support
description: Share links, contribute code or donate funds to the ongoing research and development
date: 2021-01-05
topContent: true
cover: diego-catto.jpg
buttons:
  - url: "https://instagram.com/chromatone.center"
    text: "@chromatone.center"
    type: instagram
  - url: "https://www.reddit.com/r/chromatone"
    text: r/chromatone
    type: reddit
  - url: "https://github.com/chromatone/"
    text: "GitHub Organisation"
    type: github
---

<script setup>
import { defineClientComponent } from 'vitepress'

const MapGlobe = defineClientComponent(() => {
  return import('./MapGlobe.vue')
})

import map from '#/db/map.yml'
const dots = map.cities.map(city=>city.coord)
</script>

<map-globe class="mb-8" :dots="dots" />

Chromatone is an open source initiative made not to be a proprietary standard, but to become a wide spread language, used by musicians, visual artists along with music gear companies and app developers all over the world.

## Follow and share

We have a subreddit to hang around and an Instagram account to tag in your posts. And it's important to let more people join the growing community of visual musicians. So follow us and spread the word about Chromatone through your social media and beyond.

<!-- <a href="https://www.producthunt.com/posts/chromatone?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chromatone" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=381642&theme=neutral" alt="Chromatone - Visual&#0032;music&#0032;language&#0032;to&#0032;learn&#0044;&#0160;explore&#0032;and&#0032;express&#0032;with | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a> -->

- [instagram.com/chromatone.center](https://instagram.com/chromatone.center/)
- [reddit.com/r/chromatone](https://reddit.com/r/chromatone)

We are those, who learn, teach, explore and produce music with help of the new clean visual language. And it's getting better with every contribution. Say hi and someone will reply. Everything starts from the first step. More to build together!

## Contribute code

If you're a designer, JS developer, audio analysis library or know how else the site may be better - contribute code to our open [GitHub repository](https://github.com/chromatone). Or at least press that star button in the right top corner.

## Give us a star

In future the project will grow big enough to become an Open Collective to be transparent about all the funding and expenses. We need to have at least 100 stars at [the repository on GitHub](https://github.com/chromatone/chromatone.center). Let's do it!

[![Star History Chart](https://api.star-history.com/svg?repos=chromatone/chromatone.center&type=Date)](https://star-history.com/#chromatone/chromatone.center&Date)
