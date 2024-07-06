---
title: ChucK
description: Music programming language
date: 2012-05-23
cover: ch.png
layout: app
links:
  - https://chuck.stanford.edu/
  - https://chuck.stanford.edu/ide/#
  - https://chuck.stanford.edu/doc/examples/
  - https://artful.design/stuff/samples/chuck.pdf
  - https://github.com/ccrma/webchuck
  - https://github.com/ccrma/webchuck/blob/main/docs/classes/Chuck.md
---

<script setup>
import { defineClientComponent } from 'vitepress'

const WebChuck = defineClientComponent(() => {
  return import('./SynthChuck.vue')
})
</script>

<WebChuck/>

## Strongly-timed | Concurrent | On-the-fly


[ChucK](https://chuck.stanford.edu/) is a programming language for real-time sound synthesis and music creation. ChucK offers a unique **time-based, concurrent programming model** that is precise and expressive (we call this **strongly-timed**), dynamic control rates, and the ability to add and modify code **on-the-fly**. In addition, ChucK supports MIDI, OpenSoundControl, HID device, and multi-channel audio. It is open-source and freely available on macOS, Windows, and Linux. It's fun and easy to learn, and offers composers, researchers, and performers a powerful programming tool for building and experimenting with complex audio synthesis/analysis programs, and real-time interactive music.


<youtube-embed video="2rpk461T6l4"/>
