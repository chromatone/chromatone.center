---
title: Visuals
description: Apps that don't produce sound, but show pictures and react to sound or midi
date: 2021-03-25
---

Chromatone can be very precise in assigning colors to frequencies and we can use it to analyze and communicate music. But we can use this new music communication layer as a base for new visual explorations. Visual apps reacting to audio and MIDI are created here.

One of the most complex no-build client-side Vue JS apps in our library is such a visualization of the incoming MIDI signals. [Midi-paper](./paper/index.md) is a multichannel reactive 2D MIDI visualization canvas with more than 8 layers of meaningful minimalistic vector graphics appearing on the screen. Made with Paper.js and Vue it's lightweight and efficient. Layers are pluggable and the app is self-contained in a folder nicely.

[Hydra synth](./hydra/index.md) is just a minimalistic experiment to run Hydra - the JS tool to live code shader effects with quite simple syntax.  Minimal working prototype is here, now anyone can use it as a starter template for their own creations. What direction will this take at Chromatone - we'll see sometime soon.