---
title: Shop
description: Vinyl stickers for musical instruments and paper posters, memos and more to print! The stickers are satisfyingly durable and are cut in very optimized layouts. One sheet can cover many instruments, so you can share your set with friends. 
date: 2021-05-20
---

<script setup>
import mapOl from './map-ol.vue'
import map from '#/db/map.yml'
</script>

We are the growing global community of more than **{{map.cities.length +10}}** musicians worldwide who've already implemented Chromatone into our daily music practice. Join us today!

It's great having all the interactive tools available online, but there are times when screen is just isn't enough. Having colorful notes directly on the keys or [frets](./fretboard/index.md) of your instrument is a great help in learning and exploring music. So we design and print high quality [vinyl stickers](./keys/index.md) for almost any use case.

And also we have prints. [Laminated memos](./memo/index.md) and cheat-sheets can lay around as you practice and grow - they're your sources of truth about the scales and modes, keys and chords. No need to memorize everything by heart or rely only on muscle memory – the essense of music theory can always be in your pocket. Even offline.

<map-ol :cities="map.cities" />
