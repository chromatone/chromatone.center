---
title: Grid
subtitle: Write note sequences in flexible grids

date: 2021-11-02
cover: grid.png
todo:
  - MIDI out channels
  - midi out on-off
  - solo
  - mutes
  - synth
---

<script setup>
import pitchGrids from './grids.vue'
</script>

<client-only >
  <control-scale />
  <pitch-grids />
  <state-transport />

</client-only>
