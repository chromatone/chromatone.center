---
title: Scales
subtitle: A scale is a subset of 12 chromatic pitches
tags: music
list: scales
cover: theory/notation/gray-notes.svg
date: 2021-08-28
---
There is no rule stating how many notes a scale must include. The most common scales in Western music contain seven pitches and are thus called “heptatonic” (meaning “seven tones”). Other scales have fewer notes—five-note “pentatonic” scales are quite common in popular music. There’s even a scale that uses all 12 pitches: it’s called the “chromatic” scale.

What we have in the 12-tone system is a binary "word" made of 12 bits. We can assign one bit to each degree of the chromatic scale, and use the power of binary arithmetic and logic to do some pretty awesome analysis with them. When represented as bits it reads from right to left - the lowest bit is the root, and each bit going from right to left ascends by one semitone.

The total number of possible combinations of on and off bits is called the "power set". The number of sets in a power set of size n is (2^n). Using a word of 12 bits, the power set (2^12) is equal to 4096. The fun thing about binary power sets is that we can produce every possible combination, by merely invoking the integers from 0 (no tones) to 4095 (all 12 tones).

This means that every possible combination of tones in the 12-tone set can be represented by a number between 0 and 4095. We don't need to remember the fancy names like "phrygian", we can just call it scale number 1451. Convenient!

> An important concept here is that any set of tones can be represented by a number. This number is not "ordinal" - it's not merely describing the position of the set in an indexed scheme; it's also not "cardinal" because it's not describing an amount of something. This is a nominal number because the number *is* the scale. You can do binary arithmetic with it, and you are adding and subtracting scales with no need to convert the scale into some other representation.

## Interval Pattern

Another popular way of representing a scale is by its interval pattern. When I was learning the major scale, I was taught to say aloud: "tone, tone, semitone, tone, tone, tone, semitone". Many music theorists like to represent a scale this way because it's accurate and easy to understand: "TTSTTTS". Having a scale's interval pattern has merit as an intermediary step can make some kinds of analysis simpler. Expressed numerically - which is more convenient for computation - the major scale is [2,2,1,2,2,2,1].

## Pitch Class Sets

Yet another way to represent a scale is as a "pitch class set", where the tones are assigned numbers 0 to 11 (sometimes using "T" and "E" for 10 and 11), and the set enumerates the ones present in the scale. A pitch class set for the major scale is notated like this: {0,2,4,5,7,9,11}. The "scales" we'll study here are a subset of Pitch Classes (ie those that have a root, and obey Zeitler's Rules) and we can use many of the same mathematical tricks to manipulate them.

## What is a scale?

Or more importantly, what is *not* a scale?

Now that we have the superset of all possible sets of tones, we can whittle it down to exclude ones that we don't consider to be a legitimate "scale". We can do this with just two rules.

### A scale starts on the root tone.

This means any set of notes that doesn't have that first bit turned on is not eligible to be called a scale. This cuts our power set in exactly half, leaving 2048 sets.

In binary, it's easy to see that the first bit is on or off. In decimal, you can easily tell this by whether the number is odd or even. All even numbers have the first bit off; therefore all scales are represented by an odd number.

We could have cut some corners in our discussion of scales by omitting the root tone (always assumed to be on) to work with 11 bits instead of 12, but there are compelling reasons for keeping the 12-bit number for our scales, such as simplifying the analysis of symmetry, simplifying the calculation of modes, and performing analysis of sonorities that do not include the root, where an even number is appropriate.

Scales remaining: **2048**

### A scale does not have any leaps greater than n semitones.

For the purposes of this exercise we are saying n = 4, a.k.a. a major third. Any collection of tones that has an interval greater than a major third is not considered a "scale". This configuration is consistent with Zeitler's constant used to generate his comprehensive list of scales.

Scales remaining: **1490**

Now that we've whittled our set of tones to only the ones we'd call a "scale", let's count how many there are with each number of tones.

| number of tones | how many scales |
| :-------------- | :-------------- |
| 1	              | 0               |
| 2               | 0               |
| 3               | 1               |
| 4               | 31              |
| 5               | 155             |
| 6               | 336             |
| 7               | 413             |
| 8               | 322             |
| 9               | 165             |
| 10              | 55              |
| 11              | 11              |
| 12              | 1               |

## Modes

There is a lot of confusion about what is a "mode", chiefly because the word is used slightly differently in various contexts.

When we say "C major", the word "major" refers to a specific pattern of whole- and half-steps. The "C" tells us to begin that pattern on the root tone of "C".

Modes are created when you use the same patterns of whole- and half-steps, but you begin on a different step. For instance, the "D Dorian" mode uses all the same notes as C major (the white keys on a piano), but it begins with D. Compared with the Major (also known as "Ionian" mode), the Dorian sounds different, because relative to the root note D, it has a minor third and a minor seventh.

The best way to understand modes is to think of a toy piano where the black keys are just painted on - all you have are the white keys: C D E F G A B. Can you play a song that sounds like it's in a minor key? You can't play a song in C minor, because that would require three flats. So instead you play the song with A as the root (A B C D E F G). That scale is a mode of the major scale, called the Aeolian Mode.

When you play that minor scale, you're not playing "C minor", you're playing the relative minor of C, which is "A minor". Modes are relatives of each other if they have the same pattern of steps, starting on different steps.

To compute a mode of the current scale, we "rotate" all the notes down one semitone. Then if the rotated notes have an on bit in the root, then it is a mode of the original scale. It's as if you take the bracelet diagram that we've been using throughout this study, and twist it like a dial so that a different note is at the top, in the root position.

- 101010110101 = 2741 - major scale, "ionian" mode
-  110101011010 = 3418 - rotated down 1 semitone - not a scale
-  011010101101 = 1709 - rotated down 2 semitones - "dorian"
-  101101010110 = 2902 - rotated down 3 semitones - not a scale
-  010110101011 = 1451 - rotated down 4 semitones - "phrygian"
-  101011010101 = 2773 - rotated down 5 semitones - "lydian"
-  110101101010 = 3434 - rotated down 6 semitones - not a scale
-  011010110101 = 1717 - rotated down 7 semitones - "mixolydian"
-  101101011010 = 2906 - rotated down 8 semitones - not a scale
-  010110101101 = 1453 - rotated down 9 semitones - "aeolian"
-  101011010110 = 2774 - rotated down 10 semitones - not a scale
-  010101101011 = 1387 - rotated down 11 semitones - "locrian"
			

When we do this to every scale, we see modal relationships between scales, and we also discover symmetries when a scale is a mode of itself on another degree.

## Imperfection

Imperfection is a concept invented (so far as I can tell) by William Zeitler, to describe the presence or absense of perfect fifths in the scale tones. Any tone in the scale that does not have the perfect fifth above it represented in the scale is an "imperfect" tone. The number of imperfections is a metric that plausibly correlates with the perception of dissonance in a sonority.

The only scale that has no imperfections is the 12-tone chromatic scale.

https://ianring.com/musictheory/scales/

https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes