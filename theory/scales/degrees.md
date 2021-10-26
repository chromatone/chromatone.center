---
title: Scale degrees
subtitle: Positions of notes on a scale
date: 2021-09-10
tags: scales
progressions:
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

The term scale degree refers to the position of a particular note on a scale relative to the tonic, the first and main note of the scale from which each octave is assumed to begin. Degrees are useful for indicating the size of intervals and chords and whether they are major or minor. 

In the most general sense, the scale degree is the number given to each step of the scale, usually starting with 1 for tonic. In a more specific sense, scale degrees are given names that indicate their particular function within the scale. This definition implies a functional scale, as is the case in tonal music. 

<scale-degrees />

The degrees of the traditional major and minor scales may be identified several ways:

- by their ordinal numbers, as the first, second, third, fourth, fifth, sixth, or seventh degrees of the scale, sometimes raised or lowered;
- by Arabic numerals (1, 2, 3, 4 …), as in the Nashville Number System, sometimes with carets (scale degree 1, scale degree 2, scale degree 3, scale degree 4 …);
- by their name according to the movable do solfège system: do, re, mi, fa, so(l), la, and si (or ti).
- by Roman numerals (I, II, III, IV …);
- by the English name for their function: 
  - tonic, 
  - supertonic, 
  - mediant, 
  - subdominant, 
  - dominant, 
  - submediant, 
  - subtonic or leading note (leading tone in the United States), 
  - and tonic again. 
  
  
These names are derived from a scheme where the tonic note is the 'centre'. Then the supertonic and subtonic are, respectively, a second above and below the tonic; the mediant and submediant are a third above and below it; and the dominant and subdominant are a fifth above and below the tonic.


<chord-progressions  class="mt-16" :list="$frontmatter.progressions" />