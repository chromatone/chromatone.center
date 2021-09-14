---
title: Scales
subtitle: A scale is a subset of 12 chromatic pitches
tags: music
cover: theory/notation/gray-notes.svg
date: 2021-08-22
---

<script setup>
  import {globalScale} from '@use/theory.js'
</script>

There is no rule stating how many notes a scale must include. The most common scales in Western music contain seven pitches and are thus called “heptatonic” (meaning “seven tones”). Other scales have fewer notes—five-note “pentatonic” scales are quite common in popular music. There’s even a scale that uses all 12 pitches: it’s called the “chromatic” scale.

## Pentatonic scales

Musicology commonly classifies [pentatonic scales](https://en.wikipedia.org/wiki/Pentatonic_scale) as either hemitonic or anhemitonic. Hemitonic scales contain one or more semitones and anhemitonic scales do not contain semitones. 

### Major pentatonic scale

Anhemitonic pentatonic scales can be constructed in many ways. The major pentatonic scale may be thought of as a gapped or incomplete major scale. However, the pentatonic scale has a unique character and is complete in terms of tonality. One construction takes five consecutive pitches from the circle of fifths; starting on C, these are C, G, D, A, and E. Transposing the pitches to fit into one octave rearranges the pitches into the major pentatonic scale: C, D, E, G, A. 

Another construction works backward: It omits two pitches from a diatonic scale. If one were to begin with a C major scale, for example, one might omit the fourth and the seventh scale degrees, F and B. The remaining notes then make up the major pentatonic scale: C, D, E, G, and A.

Omitting the third and seventh degrees of the C major scale obtains the notes for another transpositionally equivalent anhemitonic pentatonic scale: F, G, A, C, D. Omitting the first and fourth degrees of the C major scale gives a third anhemitonic pentatonic scale: G, A, B, D, E. 

The black keys on a piano keyboard comprise a G-flat major (or equivalently, F-sharp major) pentatonic scale: G-flat, A-flat, B-flat, D-flat, and E-flat, which is exploited in Chopin's black key étude. 

<audio class="mx-auto my-4" controls>
<source src="/media/audio/Frederic_Chopin_-_Opus_10_-_Twelve_Grand_Etudes_-_G_Flat_Major.mp3" type="audio/mpeg">
</audio>

### Minor pentatonic scale

Although various hemitonic pentatonic scales might be called minor, the term is most commonly applied to the relative minor pentatonic derived from the major pentatonic, using scale tones 1, 3, 4, 5, and 7 of the natural minor scale. (It may also be considered a gapped blues scale.) The C minor pentatonic scale, the relative of the E-flat pentatonic scale is C, E-flat, F, G, B-flat. The A minor pentatonic, the relative minor of C pentatonic, comprises the same tones as the C major pentatonic, starting on A, giving A, C, D, E, G. This minor pentatonic contains all three tones of an A minor triad.

The standard tuning of a guitar uses the notes of an E minor pentatonic scale: E-A-D-G-B-E, contributing to its frequency in popular music.

## What Is a Diatonic Scale?

A diatonic scale is a type of musical scale that contains seven tones of a note per octave (the distance between one note and the following note that also bears its name).

### Tones
Diatonic scales consist of five whole tones, also known as whole steps or the major second, and two half steps (semitones), which are the shortest musical intervals (the distance between tones) in Western music, separated by either two or three tones. A whole step on a piano keyboard represents two keys, while a half step is a single key.

### Letter names
Also known as a heptatonic scale in music theory, diatonic scales use all seven letter names, or notes in a sequence. Chords built from the seven notes in each key are called diatonic chords. Tonality, or the system of organizing keys and chords in Western music, has been based on the diatonic system from the Middle Ages to the present day.

### Scales
Diatonic scales include both the major scale, or Ionian mode, which is the most frequently used musical scale, and the natural minor scale, or Aeolian mode, which uses the same number of notes as the major scale, but in a different pitch. Both scales are part of the six “church mode” scales established for religious music during the medieval period, which continue to form the basis for contemporary diatonic scales. 

## Root note

These scales always have a tonal center to which all the notes relate and lead to in different ways. It is called the root note of the scale.

<piano-keys class="max-w-25em mx-auto my-8" v-model:pitch="globalScale.tonic" names/>

## The 7 Modes of the Diatonic Scale

The diatonic scale has seven modes:

### Major scale
- <chroma-row :tonic="globalScale.tonic" :chroma="'101011010101'" />
Also known as the Ionian mode, the major scale consists of the seven distinct notes in a scale (C D E F G A B) and an eighth note that reproduces the first one in a higher octave. The eight notes are arranged in an ascending pattern known as scale steps or scale degrees, each of which has a specific name: the first is the tonic; the second, supertonic; the third, mediant; fourth, subdominant; fifth, dominant; sixth, submediant; seventh, leading tone; and eighth, the tonic in a higher octave. The first, third, and fifth degrees form a chord known as a major triad, which can be found in related major scales, like the harmonic major scale, which has a minor sixth triad. The melodic major scale, also known as the Aeolian dominant scale, has lowered sixth and seventh degrees.

### Dorian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'101101010110'" />
The modern Dorian mode, also known as the Russian mode, is built around the D note, the second note on the major scale. Music experts consider it a minor chord because its third note is a minor third, meaning that it’s lowered by a half step and a flattened seventh note, which results in a melancholy sound.

### Phrygian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'110101011010'" />
The Phrygian scale, which begins on the E note, the third on the major scale, and ends at E major, is considered a minor chord due to its abundance of minor notes (second, third, sixth, and seventh), and as such, is infrequently used. Its dominant sound is somewhat exotic; flamenco music from Spain is often written in Phrygian mode.

### Lydian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'101010110101'" />
The fourth mode, Lydian, is a bright-sounding mode that begins with the F note. It’s similar to the major scale with one exception: its fourth scale degree is raised by a semitone.

### Mixolydian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'101011010110'" />
Also known as the dominant mode, the fifth mode, Mixolydian, covers G to G major on the keyboard and, like the Lydian mode, very similar to the major scale save for its seventh note, which is lowered by a semitone. Jazz and blues make excellent use of the Mixolydian mode.

### Aeolian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'101101011010'" />
The Aeolian, or natural minor mode, opens with the A note on the white keys of a piano keyboard, and follows the same scale degrees as the major scale, except for its minor third. Like the Dorian mode, it has a melancholy sound with an extra degree of sadness.

### Locrian mode
- <chroma-row :tonic="globalScale.tonic" :chroma="'110101101010'" />
The seventh and final mode, Locrian, is also one of the least employed modes due to its dark and minor sound built around the B note. Like the Dorian, Aeolian, and Phrygian, the Locrian has a minor third, but also a minor second and fifth; the latter gives the mode a sense of being interrupted or unfinished. 

