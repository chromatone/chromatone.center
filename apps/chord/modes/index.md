---
title: Mode degrees
subtitle: Chords of diatonic mode degrees
date: 2021-06-10

modes:
  major:
    title: Major
    degrees: Imaj7-IIm7-IIIm7-IVmaj7-V7-VIm7-VIIm7b5
  dorian:
    title: Dorian
    degrees: Im7-IIm7-bIIImaj7-IV7-Vm7-VIm7b5-bVIImaj7
  phrygian:
    title: Phrygian
    degrees: Im7-bIImaj7-bIII7-IVm7-Vm7b5-bVImaj7-bVIIm7
  lydian:
    title: Lydian
    degrees: Imaj7-II7-IIIm7-#IVm7b5-Vmaj7-VIm7-VIIm7
  myxolydian:
    title: Mixolydian
    degrees: I7-IIm7-IIIm7b5-IVmaj7-Vm7-VIm7-bVIImaj7
  aeolian:
    title: Minor
    degrees: Im7-IIm7b5-bIIImaj7-IVm7-Vm7-bVImaj7-bVII7
  locrian:
    title: Locrian
    degrees: Im7b5-bIImaj7-bIIIm7-IVm7-bVmaj7-bVI7-bVIIm7
  natural:
    title: Natural minor
    degrees: Im7-IIm7b5-IIImaj7-IVm7-Vm7-VImaj7-VII7
  harmonic:
    title: Harmonic minor
    degrees: ImMaj7-IIm7b5-III+maj7-IVm7-V7-VImaj7-VIIo7
  melodic:
    title: Melodic minor
    degrees: Im6-IIm7-III+maj7-IV7-V7-VIm7b5-VIIm7b5
---

<chord-progressions  class="mt-16" :list="$frontmatter.modes" />
