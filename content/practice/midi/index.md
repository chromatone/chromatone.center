---
title: MIDI
description: Seeing digital music information streams
cover: puk-khantho.jpg
date: 2021-09-10
---

MIDI is the global standard for transfering music information. It's a protocol, that consists of small realtime commands, that you can observe with any MIDI-enabled browser and MIDI conroller connected to your device with the [MIDI Log app](./log/index.md).

[MIDI Router](./router/index.md) may help you transfer messages from certain inputs to certain outputs for building even quite complex setups. All the notes played and all the knobs changed are nicely visualised in the [MIDI monitor](./monitor/index.md) or drawn on an endless [MIDI Roll](./roll/index.md). And if we loop the roll around a central axis, we get the [MIDI radar](./radar/index.md) that spins at the speed of current clock signal and marks all events on the circular timeline.

If you've found some nice melodic or harmonic moves and want to save it for later - try the [MIDI Recorder](./recorder/index.md). Save the .mid files to your device and analyze them later with the experimental [MIDI File Visualizer](./visualizer/index.md).

## How to output MIDI from Chromatone web-apps to your DAW

### 1. Set up the MIDI Driver
   - On a Mac:
      - Open the "Audio-Midi Setup" app.
      - In the menu, select Window -> Midi-Studio.
      - Double Click "IAC Driver".
      - Make sure "Device is ready" is checked.
   - On a Windows PC: Install [loopMidi](http://www.tobias-erichsen.de/software/loopmidi.html)
  
Check out [Ableton's guide](https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus) for more information and screenshots (applies to all DAWs).

### 2. Enable the Midi device in your DAW
Depending on the DAW you use, there might be additional steps you have to take.

In Ableton Live, open up Preferences ->  Link | Tempo | Midi. Under "Midi Ports" there is an entry called "In: IAC Driver". Make sure "Track" and "Remote" is checked.

### 3. Make sure MIDI OUT is enabled in Chromatone
