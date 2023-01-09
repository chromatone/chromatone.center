---
title: Roll
subtitle: Record all MIDI notes on an infinite roll

cover: midi-roll.png
date: 2022-06-16
---

<script setup>
import midiRoll from './roll.vue'
</script>

<client-only >

  <midi-roll />
  <midi-panel style="margin-top: 2em;" />
</client-only>

1. Play some notes on your MIDI controller or computer keyboard and watch them appear on the endless roll.
2. Drag over the canvas to change the roll speed.
3. Press the <i class="p-3 mr-1 i-la-arrow-up"></i> (<i class="p-3 mr-1 i-la-arrow-left"></i> ) button to change the plot direction
4. Press the <i class="p-3 mr-1 i-la-expand"></i> button to expand the app to full screen
