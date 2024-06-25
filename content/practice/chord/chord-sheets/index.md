---
title: Chord Sheets Lab
description: Chordsheetjs experiments
date: 2021-07-03
cover: cover.png
layout: app
links:
  - https://snyk.io/advisor/npm-package/chordsheetjs/example
  - https://martijnversluis.github.io/ChordFiddle/
  - https://github.com/martijnversluis/ChordSheetJS
  - https://www.chordpro.org/chordpro/chordpro6-relnotes/
---

<script setup>
import { defineClientComponent } from 'vitepress'

const ChordSheets = defineClientComponent(() => {
  return import('./ChordSheets.vue')
})
</script>

<ChordSheets/>

[ChordSheetJS Playground](https://github.com/martijnversluis/ChordSheetJS)
