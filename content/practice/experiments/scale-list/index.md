---
title: Scale lists
description: Lists of all scales from different sources
date: 2004-04-30
---


<script setup>
import {ScaleType} from 'tonal'

import {computed, reactive} from 'vue'
import scaleList from '../../../../db/scale/scale-list.yaml'

const scales = {}

scaleList.forEach(s=> {
  scales[s.n_notes] = scales[s.n_notes] || {}
  scales[s.n_notes][s.mode_name] = String(s.semitones).split('').map(Number).map(n=>[1,...Array(n-1).fill(0)]).flat().join('')
})

const listScales = {}

ScaleType.all().forEach(s=> {
  listScales[s.intervals.length] = listScales[s.intervals.length] || {}
  listScales[s.intervals.length][s.name] = s.chroma
})

</script>

<h3><a href="https://github.com/tonaljs/tonal/tree/main/packages/scale-type" target="_blank">Tonal.js</a> scales list</h3>
<textarea class="m-8 p-4 text-xs h-100">
{{listScales}}
</textarea>

<h3><a href="https://allthescales.org/downloads.php" target="_blank">AllTheScales.org</a> scales list in comma-delimited csv format</h3>
<textarea class="m-8 p-4 text-xs h-100">
{{scales}}
</textarea>
