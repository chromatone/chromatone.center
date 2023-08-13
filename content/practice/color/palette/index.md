---
title: Color palette generator
description: Poline and other tools by meodai
date: 2020-08-12
cover: cover.png
links:
  - https://meodai.github.io/poline/
  - https://github.com/meodai/poline
  - https://codepen.io/meodai/pen/pXNpXe
  - https://codepen.io/meodai/pen/xWNNwN
  - https://github.com/meodai/color-names
---

<script setup>
import ColorPalette from './ColorPalette.vue'
</script>

<client-only>
  <color-palette class="max-w-58ch rounded-2xl overflow-hidden" />
</client-only>

- Drag top and bottom rectangles to change Hue, Saturation and Lightness of both start and end colors of your palette.
- Drag the list of steps to change the number of steps in your palette
