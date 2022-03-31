---
title: Recorder
subtitle: Record MIDI as you play – visualize and save your music
date: 2021-08-04

sources:
  - https://github.com/1j01/midi-recorder/
  - https://github.com/Tonejs/Midi
  - https://github.com/Tonejs/Tone.js/wiki/TransportTime
  - https://webmidijs.org/docs/v3.0.0-alpha.10/index.html
status: alpha
version: 0.1
---

<script setup>
import midiRecorder from './recorder.vue'
</script>

<client-only>
  <midi-recorder />
</client-only>

## Work in progress

This app is a draft to be iterated on. The idea is to make a tool to record some kind of visual midi sketches and store them as mid files and also directly in the browser.
