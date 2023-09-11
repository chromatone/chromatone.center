---
title: Classic European music staff notation
description: How the sheet notes are written and read from classic era till today
date: 2021-08-12
cover: kvintcirklen.png
links:
  - https://en.wikibooks.org/wiki/Music_Theory/Music_Notation_Systems
---

<script setup>
import { state } from '../../../../components/abc/state'

const minuet = `
X:409
T:Minuet in G Major
T:BWV Anhang 114
C:Christian Petzold (1677-1733)
C:Formerly attributed to J. S. Bach
C:(Guitar chords added)
Z:ClassicMan at musescore.com
Z:abc-edited-by: AW
L:1/4
M:3/4
I:linebreak $
K:G
V:1 treble %nm="Piano"
V:2 treble
V:3 bass
V:4 bass
V:1
"G"d G/A/"D7/a"B/c/ | "G/b"d .G .G | "C"e Mc/d/e/f/ | "G/b"g .G .G | \
"Am"Mc d/c/""B/A/ | "G"B c/B/A/G/ | "D"F "G"G/A/B/G/ |"D    D7"{B} A3 |$
"G"d G/A/"D7/a"B/c/ | "G/b"d .G .G | "C"e Mc/d/e/f/ | "G/b"g .G .G | \
"Am"Mc d/c/"D/f#"B/A/ | "G"B c/B/"G/b"A/G/ | "Am/c"A "G/d"B/A/"D"G/F/ | "G"G3 ::$
%
"G"b g/a/b/g/ | "D/f#"a d/e/f/d/ | "Em"g e/f/g/d/ | "A"^c B/c/ A | \
"A"A/B/^c/d/e/f/ | "G/b"g "D"f "A/c#"e | "D"f "D/f#"A "A"^c | "D       D7"d3 |$
"G/b"d G/F/ G | "C"e G/F/ G | "G/b"d "D/a"c "G"B | "D"A/G/F/G/ A | \
"D"D/E/F/G/A/B/ | "C/e"c "G"PB "D/f#"A | "G"B/d/ "G/b"G "D"F | "G"G3 :|
V:2
x3 | x3 | x3 | x3 | x3 | x3 | x3 | x3 |$ x3 | x3 | x3 | x3 | x3 | x3 | x3 | x3 ::$ x3 | x3 | x3 |
x3 | x3 | x3 | x3 | x3 |$ x3 | x3 | x3 | x3 | x3 | x3 | x3 | [B,D]3 :|
V:3
[B,D]2 A, | B,3 | C3 | B,3 | A,3 | G,3 | D B, G, | D D,/C/B,/A,/ |$ B,2 A, | G, .B, .G, | C3 |
B, C/B,/A,/G,/ | A,2 F, | G,2 B, | C D D, | G,2 G,, ::$ G,3 | F,3 | E, G, E, | A,2 A,, | A,3 |
B, D ^C | D F, A, | D D, =C |$ z D2 | z E2 | B, A, G, | D2 z | z z F, | E, G, F, | G, B,, D, |
G, D, G,, :|
V:4
G,2 x | x3 | x3 | x3 | x3 | x3 | x3 | x3 |$ x3 | x3 | x3 | x3 | x3 | x3 | x3 | x3 ::$ x3 | x3 |
x3 | x3 | x3 | x3 | x3 | x3 |$ B,2 B, | C2 C | x3 | x3 | D,3 | x3 | x3 | x3 :|
`
</script>

<button :style="{background: state.colorize ? 'linear-gradient(#e66465, #9198e5)': ''}" class="button fixed right-16 bottom-4 z-20000 p-2 bg-light-400 dark-bg-dark-400 rounded-xl shadow active_bg-red-100"
@click="state.colorize = !state.colorize">Colorize notes</button>

![](./kvintcirklen.png)

Standard notation is used to demonstrate how a piece is played. Unlike tablature, it applies to any instrument. It indicates key signatures, time signatures, rhythms, tempo, dynamics (how loud each instrument should be), and so on. A highly trained musician can sometimes take a piece of sheet music written in standard notation, look it over once or twice, and then play the song as though he or she had been playing it his or her whole life.

For instance, below is the C major scale, including a C at the end, in standard notation.

The standard notation staff has five lines and four spaces. From bottom to top the five lines are E G B D F, which is commonly memorized as an acrostic such as:

- **E**very
- **G**ood
- **B**oy
- **D**oes
- **F**ine

The four spaces between the five lines are F, A, C, and E, which should surely be easy for an English speaker to remember, because together they spell "face".

But what about the first two notes, which are below the staff? Well, the second note is just below the E, so it must be D. The first is below that, so it must be C. It also has a line through it to indicate it is placed on an "invisible" line. This line is called a ledger line. A note could be placed below this ledger line, which would be B. Or a note could be placed below that, on another ledger line, and it would be A. Notes can continue to be placed on ledger lines above and below the staff infinitely, but extending too far from the staff is impractical, because the pitches will become very hard to read.

## Clefs

1. Treble (G) <abc-render :abc="'K:treble\nG8'" />
2. Bass (F) <abc-render :abc="'K:bass\nF,8'" />
3. Baritone (F) <abc-render :abc="'K:bass3\nF,8'" />
4. Tenor (C) <abc-render :abc="'K:tenor\nc,8'" />
5. Alto (C) <abc-render :abc="'K:alto\nc,8'" />
6. Mezzosoprano (C) <abc-render :abc="'K:alto2\nc,8'" />
7. Soprano (C) <abc-render :abc="'K:alto1\nc,8'" />

## Note pitch

### Natural (G)

<abc-render :abc="'G8'" />

<abc-render :abc="'K:Gb\n=G8'" />

### Sharp (G#)

<abc-render :abc="'^G8'" />

<abc-render :abc="'K:Gb\n^^G8'" />

### Flat (Gb)

<abc-render :abc="'_G8'" />

<abc-render :abc="'K:C#\n__G8'" />

### Ascending

A A# B C C# D D# E F F# G G# A

<abc-render responsive :abc="'A,^A,B,C^CD^DEF^FG^GA'" />

### Descending

A Ab G Gb F E Eb D Db C B Bb A

<abc-render responsive :abc="`a,_a,G_GFE_ED_DCB,_B,A,`" />

![](./chromatic-c.jpg)
![](./chromatic-Eb.jpg)

## Note values (durations)

Whole note = 2 half notes = 4 quarter notes = 8 eighth notes = 16 sixteenth notes

<abc-render responsive :abc="`M:4/4\n|G8|G4A4|G2A2B2c2|GDGDGDGD|G/D/G/D/G/D/G/D/G/D/G/D/G/D/G/D/|`" />

### Dotted notes

<abc-render responsive :abc="`M:4/4\n|(G12|G4)|G5G2|G3GG3G|G3/2G/2G3/2G/2G3/2G/2G3/2G/2|`" />

### Triplets

<abc-render responsive :abc="`M:4/4\n|(3G4A4B4|(3G2A2B2 (3G2A2B2| (3GAB (3GAB (3GAB (3GAB|`" />

### Other tuplets

<abc-render responsive :abc="`M:4/4\n|(5G2A2B2c2d2|(7CDEFGAB|`" />

### Rests

<abc-render responsive :abc="`M:4/4\n|z8|z4z4|z2z2z2z2|zzzzzzzz|z/z/z/z/z/z/z/z/z/z/z/z/z/z/z/z/|`" />

![](./note-values-and-rests.png)

> ![](./Bachlut1.png)
> J.S.Bach Prelude

### Alexander Scriabin - Piano Concerto in F sharp minor, Op. 20

<youtube-embed video="F734PyD3NAw" />

## Vector render of staff notation by ABCjs

Note colorization is very useful to build connections between classic and Chromatone music theory visualizations.
<abc-render responsive :abc="minuet" />

[Play with the ABC notations editor](../computer/abc/index.md)

[Sight reading](./sight-reading/index.md)

[European tradition](./evolution/index.md)
