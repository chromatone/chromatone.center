---
title: Chords with 5 notes and more
description: Extended chords, added tone chords and other complex interval combinations
cover: gabriel-gurrola.jpg
date: 2021-09-01

---


<script setup>
import pentad from '#/db/chord/pentad.yaml'

import {ChordType} from 'tonal'

const more = ChordType.all().filter((get) => get.intervals.length>5)
  .filter(get=>get)
  .sort((a,b)=>a.chroma>b.chroma ? -1 :1)
  .map((get) => ({
    chroma: get.chroma,
    title: get.name || get.aliases?.[0]
  }));
</script>

## Pentads – the five note chords

<chroma-profile-collection :collection="pentad" />

## Chords with 6 and more notes

<chroma-profile-collection :collection="more" />

<youtube-embed video="RFH1LD4KdWs" />
