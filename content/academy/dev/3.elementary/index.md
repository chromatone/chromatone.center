---
title: Exploring Elementary
description: Web audio development from the ground up, step by step with newly open sources Web DSP
date: 2023-06-23
cover: cover.png
---

<youtube-embed video="eCCDmcbgcR8" />

Elementary audio is an amazing open source library for building quite complex audio apps with plain JS functions, which fits perfectly into our site build pipeline. So here's my first deep dive into DSP coding with Elementary.

https://www.elementary.audio

During these 2 hours coding session I was digging the docs and building a basic polyphonic synth. It needs to be running on mobile devices glitch-free for me to start seriously considering using this library in something more than just an experiment. And it happened!

I've managed to write a Vue 3 Composable function that mounts with any component and establishes a proper MIDI-synth with multiple sine voices and a volume knob. We've went through the initial challenges and I've shown my thought and code design process. You can follow the component development here:  https://github.com/chromatone/chromatone.center

And see the final result at https://chromatone.center/practice/midi/synth/
