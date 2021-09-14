---
title: Temperaments
subtitle: Tuning systems
tags: music
cover: theory/et-limits.svg
date: 2021-08-20
---


## Monochord

Drag the divider to explore the string divisions of a monochord, just like Pythagoras did.

<client-only>
  <string-monochord />
</client-only>

## Pythagorean tuning

Pythagorean tuning, or 3-limit tuning, also allows ratios including the number 3 and its powers, such as 3:2, a perfect fifth, and 9:4, a major ninth. 12-tone Pythagorean temperament is based on a stack of intervals called perfect fifths, each tuned in the ratio 3:2, the next simplest ratio after 2:1. Starting from D for example (D-based tuning), six other notes are produced by moving six times a ratio 3:2 up, and the remaining ones by moving the same ratio down:

    E♭–B♭–F–C–G–D–A–E–B–F♯–C♯–G♯

This succession of eleven 3:2 intervals spans across a wide range of frequency (on a piano keyboard, it encompasses 77 keys). Since notes differing in frequency by a factor of 2 are given the same name, it is customary to divide or multiply the frequencies of some of these notes by 2 or by a power of 2. The purpose of this adjustment is to move the 12 notes within a smaller range of frequency, namely within the interval between the base note D and the D above it (a note with twice its frequency). This interval is typically called the basic octave (on a piano keyboard, an octave has only 12 keys). 

![Tetractys](./Tetractys.svg)

The tetractys (Greek: τετρακτύς) is a triangular figure consisting of ten points arranged in four rows: one, two, three, and four points in each row, which is the geometrical representation of the fourth triangular number. As a mystical symbol, it was very important to the secret worship of Pythagoreanism.

## Just intonation

A twelve-tone scale can also be created by compounding harmonics up to the fifth: namely, by multiplying the frequency of a given reference note (the base note) by powers of 2, 3, or 5, or a combination of them. This method is called five-limit tuning. 

![](./pentactys.svg)

5-limit tuning encompasses ratios additionally using the number 5 and its powers, such as 5:4, a major third, and 15:8, a major seventh. 7-limit and higher systems use higher partials in the overtone series. 

## Equal temperament

In classical music and Western music in general, the most common tuning system since the 18th century has been twelve-tone equal temperament (also known as 12 equal temperament, 12-TET or 12-ET; informally abbreviated to twelve equal), which divides the octave into 12 parts, all of which are equal on a logarithmic scale, with a ratio equal to the 12th root of 2 (12√2 ≈ 1.05946). That resulting smallest interval, 1⁄12 the width of an octave, is called a semitone or half step. In Western countries the term equal temperament, without qualification, generally means [12-TET](https://en.wikipedia.org/wiki/Equal_temperament). 

### Zhu Zaiyu

Zhu Zaiyu (朱載堉), a prince of the Ming court, spent thirty years on research based on the equal temperament idea originally postulated by his father. He described his new pitch theory in his Fusion of Music and Calendar 律暦融通 published in 1580. This was followed by the publication of a detailed account of the new theory of the equal temperament with a precise numerical specification for 12-TET in his 5,000-page work Complete Compendium of Music and Pitch (Yuelü quan shu 樂律全書) in 1584.

![](./zhu-zaiyu-1154.jpg)

Zhu obtained his result mathematically by dividing the length of string and pipe successively by 12√2 ≈ 1.059463, and for pipe length by 24√2, such that after twelve divisions (an octave) the length was divided by a factor of 2:

![](/media/theory/tet/12-equation.svg)

Similarly, after 84 divisions (7 octaves) the length was divided by a factor of 128.

![](/media/theory/tet/128-equation.svg)

Zhu Zaiyu has been credited as the first person to solve the equal temperament problem mathematically.

![](./zhu-zaiyu-strings.jpg)

### Mathematics of 12-TET

![](/media/theory/tet/tet-equation.svg)

![](/media/theory/tet/tet-fifth-equation.svg)

![](/media/theory/tet/oct-equation.svg)

![](./Monochord_ET.png)

### Tuning to the beats

A precise equal temperament is possible using the 17th-century Sabbatini method of splitting the octave first into three tempered major thirds. This was also proposed by several writers during the Classical era. Tuning without beat rates but employing several checks, achieving virtually modern accuracy, was already done in the first decades of the 19th century. Using beat rates, first proposed in 1749, became common after their diffusion by Helmholtz and Ellis in the second half of the 19th century. The ultimate precision was available with 2-decimal tables published by White in 1917

![](./piano-tuning.png)

<img src="/media/theory/et-limits.svg" />


## Circle of tunings

See and hear the slight differences between Pythagorean tunings, Just intonation and 12-TET. Click on the circle to start the note. Click again to stop it. You can hear the beatings between the same notes in various tunings and also hear the quality of the intervals in each of them.

<tuning-circle />
<svg-save svg="tuning-circle" />