---
title: Router
subtitle: Forward all MIDI messages from one device to another

cover: midi-router.png
date: 2022-02-14
---

<script setup>
import midiRouter from './router.vue'
</script>

<client-only>
  <midi-panel class="mb-4" />
  <midi-router class="mb-20" />
</client-only>

Click on the desired output under the input you want to send signals from.
