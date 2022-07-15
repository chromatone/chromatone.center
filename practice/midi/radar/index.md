---
title: Radar
subtitle: Circular MIDI visualisation experiment

date: 2021-11-9
cover: geometry.png
---

<script setup>
import midiRadar from './radar.vue'
</script>

<client-only >
  <midi-panel class="mb-4" />
  <midi-radar />
</client-only>

The radar rotation is powered by MIDI clock, so please use devices with clock master available.