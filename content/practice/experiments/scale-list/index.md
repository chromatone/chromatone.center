---
title: Scale lists
description: Lists of all scales from different sources
date: 2004-04-30
---


<script setup>
import {ScaleType, Pcset} from 'tonal'

import scaleNames from '../../../../db/scale/scale-names.yaml'

const list = []

for (let s in scaleNames) {
  const scale = scaleNames[s]
  const intervals = Pcset.intervals(scale.chroma)
  list.push([intervals, scale.title, Object.values(scale.names).flat() ])
}
</script>

<textarea class="m-8 p-4 text-xs h-100">
{{ScaleType.all()}}
</textarea>

<textarea class="m-8 p-4 text-xs h-100">
{{list}}
</textarea>
