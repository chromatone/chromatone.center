---
title: Chord progressions
description: Successive chord loops as the foundation of modern music
date: 2021-10-12


web:
  - https://autochords.com/
  - https://schollz.github.io/chords/ - https://github.com/schollz/chords
  - https://chordchord.com/
  - https://www.hooktheory.com/
  - https://fanzhangg.github.io/chord-master/
  - https://github.com/tonaljs/tonal/tree/9622ec8fa4031f0c80515d278dfa06424bf159e5/packages/progression
  - https://darosh.github.io/progression/ - https://github.com/darosh/progression
  - https://github.com/ology/Data-Dataset-ChordProgressions/blob/master/share/Chord-Progressions.csv
---

<script setup>
  import progressions from '#/db/chord/progressions.yaml'
</script>

<chord-progressions :list="progressions" />
