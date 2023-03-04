---
title: Tetrads
description: All musically meaningful combinations of 4 notes

date: 2021-09-10

---



## Seventh chords

A seventh chord is a chord consisting of a triad plus a note forming an interval of a seventh above the chord's root. When not otherwise specified, a "seventh chord" usually means a dominant seventh chord: a major triad together with a minor seventh. However, a variety of sevenths may be added to a variety of triads, resulting in many different types of seventh chords.

In its earliest usage, the seventh was introduced solely as an embellishing or nonchord tone. The seventh destabilized the triad, and allowed the composer to emphasize movement in a given direction. As time passed and the collective ear of the western world became more accustomed to dissonance, the seventh was allowed to become a part of the chord itself, and in some modern music, jazz in particular, nearly every chord is a seventh chord. Additionally, the general acceptance of equal temperament during the 19th century reduced the dissonance of some earlier forms of sevenths.

Most textbooks name these chords formally by the type of triad and type of seventh; hence, a chord consisting of a major triad and a minor seventh above the root is referred to as a major/minor seventh chord. When the triad type and seventh type are identical (i.e. they are both major, minor, or diminished), the name is shortened. For instance, a major/major seventh is generally referred to as a major seventh. This rule is not valid for augmented chords: since the augmented/augmented chord is not commonly used, the abbreviation augmented is used for augmented/minor, rather than augmented/augmented. Additionally, half-diminished stands for diminished/minor, and dominant stands for major/minor. When the type is not specified at all, the triad is assumed to be major, and the seventh is understood as a minor seventh (e.g. a "C" chord is a "C major triad", and a "C7" chord is a "C major/minor seventh chord", also known as a "C dominant seventh chord").

## Tertian

The most common chords are tertian, constructed using a sequence of major thirds (spanning 4 semitones) and/or minor thirds (3 semitones). Since there are 3 third intervals in a seventh chord (4 notes) and each can be major or minor, there are 8 possible combinations, however, only seven of them are commonly found in western music. The augmented augmented seventh chord, defined by a root, a major third, an augmented fifth, and an augmented seventh (i.e., a sequence of 3 major thirds, such as C–E–G♯–B♯), is a rarely used tertian seventh chord. The reason is that the augmented seventh interval is enharmonically equivalent to one entire octave (in equal temperament, 3 major thirds = 12 semitones = 1 octave) and is hence perfectly consonant with the chord root.


<script setup>
  import tetrad from '#/db/chord/tetrad.yaml'
</script>
<chroma-profile-collection :collection="tetrad.tertian" />

---

## Non-tertian

Seventh chords can also be constructed using augmented or diminished thirds. These chords are not tertian and can be used in non-tertian harmony. There are many (mathematically, 64) chords that can be built, however, only few of them are used.

<chroma-profile-collection :collection="tetrad.nontertian" />
