---
title: Drum machine
description: Simple drum sequencer with synthesized sounds
date: 2019-11-02
layout: app
---

<client-only>
<audio-drums-sequencer class="m-2" />
</client-only>

Very basic drum machine made with Elementary.js. All sounds are synthesized by low level sound engine commands and run in independent Web Audio and WASM threads, ensuring high quality and no glitches in the sound.

## TODO

- sync with musical transport
