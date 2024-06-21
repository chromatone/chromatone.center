---
title: Bouncing sinusoids
description: Polyrhythmic explorations
date: 2024-06-18
layout: app
cover: cover.png
links: 
  - http://travisrtaylor.com/pendulum-explainer/
  - https://www.particleincell.com/2012/bezier-splines/
  - https://gist.github.com/AndreVallestero/bfd2037d10cd975b9854888df530b98a
  - https://blindsvg.com/pages/curves/
  - https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
  - https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/?ck_subscriber_id=2246502080
---


<script setup>
import { defineClientComponent } from 'vitepress'

const Bounce = defineClientComponent(() => {
  return import('./Bounce.vue')
})
</script>

<Bounce/>
