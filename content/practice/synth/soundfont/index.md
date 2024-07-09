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

import { onBeforeUnmount, onMounted } from "vue";
import { synthEnabled } from "#/use";

onMounted(() => synthEnabled.value = false)
onBeforeUnmount(() => synthEnabled.value = true)
</script>

<client-only>
<Synth-font class="m-2" />
<MidiKeys >

</MidiKeys>
</client-only>
