---
title: Physical sequencer
description: 2D rigid body physics simulator
date: 2024-05-24
layout: app
links: 
  - https://codepen.io/tt9/pen/xxEmmRO
  - https://www.paulie.dev/posts/2020/08/react-hooks-and-matter-js/
  - https://github.com/liabru/matter-js/blob/master/src/geometry/Bounds.js
  - https://brm.io/matter-js/
  - https://github.com/liabru/matter-js/wiki/Getting-started#usage-example
  - https://brm.io/matter-js/docs/classes/Body.html#property_torque
  - https://github.com/liabru/matter-js/wiki/Getting-started
  - https://github.com/kyte3/game-project/blob/main/src/components/PhysicsGame.vue
---

<script setup>
import { defineClientComponent } from 'vitepress'

const Matter = defineClientComponent(() => {
  return import('./Matter.vue')
})
</script>

<Matter/>
