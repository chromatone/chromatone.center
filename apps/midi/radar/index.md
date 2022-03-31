---
title: Radar
subtitle: Circular MIDI visualisation experiment

date: 2021-11-9
cover: apps/geometry.png
---

<script setup>
import midiRadar from './index.vue'
</script>

<client-only >
  <midi-panel class="mb-4" />
  <midi-radar />
</client-only>
