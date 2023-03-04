---
title: Color names
description: Know how to name any color of 12 equally spaced hues

date: 2021-08-01
cover: color-names.svg

---

<script setup>
import colorCards from './cards.vue'
import colorNames from './names.vue'
import col from '#/db/colors.yaml'

</script>

<color-cards :list="col.colors" :langs="col.langs" />

<color-names :list="col.colors" :langs="col.langs" />

<img src="./color-names.svg">

https://en.wikipedia.org/wiki/Tertiary_color

<img src="../models/palette.svg" width="400" height="400" />
