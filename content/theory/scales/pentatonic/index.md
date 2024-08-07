---
title: Pentatonic scales
description: 5 very consonant notes to play easily together
date: 2021-09-16

pentatonics:
  major:
    title: Major pentatonic
    chroma: "101010010100"
  minor:
    title: Minor pentatonic
    chroma: "100101010010"
  suspended:
    title: Suspended pentatonic
    chroma: "101001010010"
  blues:
    title: Blues minor pentatonic
    chroma: "100101001010"
  ms7:
    title: "Minor #7 pentatonic"
    chroma: "100101010001"
  m6:
    title: Minor Six pentatonic
    chroma: "100101010100"
japanese:
  hirajoshi:
    title: Hirajoshi
    chroma: "101100011000"
  ritusen:
    title: Ritusen
    chroma: "101001010100"
  iwato:
    title: Iwato
    chroma: "110001100010"
  kumoijoshi:
    title: Kumoijoshi
    chroma: "110001011000"
  insen:
    title: In-sen
    chroma: "110001010010"
---

Musicology commonly classifies [pentatonic scales](https://en.wikipedia.org/wiki/Pentatonic_scale) as either hemitonic or anhemitonic. Hemitonic scales contain one or more semitones and anhemitonic scales do not contain semitones.

## Major pentatonic scale

Anhemitonic pentatonic scales can be constructed in many ways. The major pentatonic scale may be thought of as a gapped or incomplete major scale. However, the pentatonic scale has a unique character and is complete in terms of tonality. One construction takes five consecutive pitches from the circle of fifths; starting on C, these are C, G, D, A, and E. Transposing the pitches to fit into one octave rearranges the pitches into the major pentatonic scale: C, D, E, G, A.

Another construction works backward: It omits two pitches from a diatonic scale. If one were to begin with a C major scale, for example, one might omit the fourth and the seventh scale degrees, F and B. The remaining notes then make up the major pentatonic scale: C, D, E, G, and A.

Omitting the third and seventh degrees of the C major scale obtains the notes for another transpositionally equivalent anhemitonic pentatonic scale: F, G, A, C, D. Omitting the first and fourth degrees of the C major scale gives a third anhemitonic pentatonic scale: G, A, B, D, E.

The black keys on a piano keyboard comprise a G-flat major (or equivalently, F-sharp major) pentatonic scale: G-flat, A-flat, B-flat, D-flat, and E-flat, which is exploited in Chopin's black key étude.

<audio class="my-4" controls>
<source src="/audio/Frederic_Chopin_-_Opus_10_-_Twelve_Grand_Etudes_-_G_Flat_Major.mp3" type="audio/mpeg">
</audio>

## Minor pentatonic scale

Although various hemitonic pentatonic scales might be called minor, the term is most commonly applied to the relative minor pentatonic derived from the major pentatonic, using scale tones 1, 3, 4, 5, and 7 of the natural minor scale. (It may also be considered a gapped blues scale.) The C minor pentatonic scale, the relative of the E-flat pentatonic scale is C, E-flat, F, G, B-flat. The A minor pentatonic, the relative minor of C pentatonic, comprises the same tones as the C major pentatonic, starting on A, giving A, C, D, E, G. This minor pentatonic contains all three tones of an A minor triad.

The standard tuning of a guitar uses the notes of an E minor pentatonic scale: E-A-D-G-B-E, contributing to its frequency in popular music.

<chroma-profile-collection :collection="$frontmatter.pentatonics" />

## Japanese scales

The organization of notes to create a musical scale has many different applications in different cultures and types of music. One of the most common approaches to organizing musical structures is known as the Mode or Mode(s). Since the Heian Period, there has been disagreement and contention between musical scholars regarding Japanese music and modal theory. There has long been a debate about Japanese modes and what defines them, to this day there is not a single modal theory that can completely explain Japanese music. Music scales are critical in clarifying and identifying musical pieces, however, there has been no single scale model that can identify all Japanese music into one classification or category of music. In order to be understood by western scholars, The different variations of Japanese modal scales are often compared to the western Major Scale. Various modal theories from around the world have been imported to attempt and analyze Japanese music structure, but often the modal theories suggested do not reflect what is actually present in the music it is being applied to. The classical structures of most Japanese music originates in China and was not concerned with developing a universal scale or mode until Western music had been imported. After the Heian period began was when Western modal theories became widely acknowledged by Japanese society, though it often stayed in its own category as it could not entirely explain Japanese music across all its different iterations.

The most common version of the Japanese mode is a somewhat inaccurate term for a pentatonic musical scale which is used commonly in traditional Japanese music. The intervals of the scale are major second, minor third, perfect fifth, and minor sixth (for example, the notes A, B, C, E, F and up to A.) - which is essentially a natural minor scale in Western music theory without the subdominant and subtonic, which is the same operation performed on the major scale to produce the pentatonic major scale. The more correct term would be kumoijoshi, as given by William P. Malm for one of the three tuning scales of the koto adapted from shamisen music.

In addition to being used almost exclusively in traditional Japanese compositions, it is found frequently in video game music and the pieces of contemporary composers such as Anne Boyd.

<chroma-profile-collection :collection="$frontmatter.japanese" />
