---
title: Soundfont sampler synth
description: Open source sample-based online synthesizer
date: 2024-06-10
layout: app
cover: cover.png
links:
  - https://github.com/danigb/smplr
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
<Synth-font class="m-2" />
<MidiKeys >

</MidiKeys>
</client-only>
