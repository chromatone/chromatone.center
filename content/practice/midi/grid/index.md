---
title: MIDI Grid
description: Reactive colorful notes grid as a performance instrument
date: 2024-10-23
layout: app
cover: cover.png
---

<script setup>
import {useWindowSize} from '@vueuse/core'

const {width,height} = useWindowSize()
</script>

<MidiGrid :width :height />
