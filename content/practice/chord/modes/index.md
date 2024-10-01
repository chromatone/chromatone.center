---
title: Mode degrees
description: Chords of diatonic mode degrees
date: 2021-06-10
cover: modes.png
layout: app
---

<script setup>
  import modes from '#/db/chords/modes.yaml'
</script>

<chord-progressions :list="modes" />
