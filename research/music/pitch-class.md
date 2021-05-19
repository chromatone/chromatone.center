---
title: Pitch class and chroma
subtitle: There is a huge amount of possible note combinations. But it's countable. And very useful to navigate music concepts.
tags: music
---

A [pitch class](https://en.wikipedia.org/wiki/Pitch_class) (p.c. or pc) is a set of all pitches that are a whole number of octaves apart, e.g., the pitch class A consists of the As in all octaves. "The pitch class A stands for all possible As, in whatever octave position."

>Although there is no formal upper or lower limit to this sequence, only a few of these pitches are audible to the human ear. Yet we can imagine seeing the [40th octave](/research/spectre/40/) as the frequency gets to the visual spectrum.

Pitch class is important because human pitch-perception is periodic: pitches belonging to the same pitch class are perceived as having a similar quality or color, a property called **"octave equivalence"**. 

Psychologists refer to the quality of a pitch as its **"chroma"**. A chroma is an attribute of pitches (as opposed to tone height), just like hue is an attribute of color. A pitch class is a set of all pitches that share the same chroma, just like "the set of all yellow things" is the collection of all yellow objects.

## Integer notation

To avoid the problem of enharmonic spellings, theorists typically represent pitch classes using numbers beginning from zero, with each successively larger integer representing a pitch class that would be one semitone higher than the preceding one, if they were all realised as actual pitches in the same octave. Because octave-related pitches belong to the same class, when an octave is reached, the numbers begin again at zero. This cyclical system is referred to as modular arithmetic and, in the usual case of chromatic twelve-tone scales, pitch-class numbering is regarded as "modulo 12" (customarily abbreviated "mod 12" in the music-theory literature)—that is, every twelfth member is identical. One can map a pitch's fundamental frequency f (measured in hertz) to a real number p using the equation

    p = 9 + 12 log 2 (⁡ f / 440  Hz ). 


This creates a linear pitch space in which octaves have size 12, semitones (the distance between adjacent keys on the piano keyboard) have size 1, and middle C (C4) is assigned the number 0 (thus, the pitches on piano are −39 to +48). Indeed, the mapping from pitch to real numbers defined in this manner forms the basis of the MIDI Tuning Standard, which uses the real numbers from 0 to 127 to represent the pitches C−1 to G9 (thus, middle C is 60). 

To represent pitch classes, we need to identify or "glue together" all pitches belonging to the same pitch class. The result is a cyclical quotient group that musicians call pitch class space and mathematicians call R/12Z. Points in this space can be labelled using real numbers in the range 0 ≤ x < 12. These numbers provide numerical alternatives to the letter names of elementary music theory:

- 0 = C, 
- 1 = C♯/D♭, 
- 2 = D, 
- 2.5 = Dhalf sharp (quarter tone sharp), 
- 3 = D♯/E♭,

and so on. In this system, pitch classes represented by integers are classes of twelve-tone equal temperament (assuming standard concert A). 
