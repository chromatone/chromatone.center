---
title: MIDI Radar
description: Circular MIDI visualisation experiment
layout: app
date: 2021-11-09
cover: geometry.png
---

<client-only >

  <midi-radar style="position: sticky; top: 0;"  />
  <midi-panel class=" mx-2 max-w-55ch"  />
</client-only>

::: info

### See all the MIDI signals on the clock

Press play on your sequencer to start run the radar by incoming MIDI-clock signal, or just press `spacebar` to start internal metronome, that will drive the radar clocks.

Drag across the circle up and down to adjust temporal zoom - ther higher the zoom, the longer the loop (from one to 8 measures).

Use MIDI channel filter section to cut visualize the exact voices of a multichannel MIDI signal.

You can toggle the internal synth on and off for using your MIDI-controller or enable audio input monitoring for your using your synths and sequencers.

:::