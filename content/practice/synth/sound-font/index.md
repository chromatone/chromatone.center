---
title: Sampled soundfonts
description: SMPLR - A modern soundfont library explorations
date: 2021-10-31
cover: cover.png
---

<script setup>
import { synth as AppSynth } from "#/use";
  import { onBeforeUnmount, onMounted } from "vue";

onMounted(() => {
  AppSynth.state.midi = false
})

onBeforeUnmount(() => {
  AppSynth.state.midi = true
})
</script>

<client-only>
<Synth-font />
</client-only>
