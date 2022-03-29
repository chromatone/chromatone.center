---
title: Chromatone color notation
subtitle: Different ways to implementing the color-frequency equations for writing and reading music

date: 2021-06-01
cover: apps/midi-roll.png
---

There's a plenty of possible ways to make the Chromatone system work for written music communication. This whole web site is one big experiment to find the most useful implications of the simple equations. But there's more to explore!

## Colorize the staff notation

First and the most obvious use of color in music is a simple coloring the regular staff notation. You can use 12 markers to denote any pitch on paper and we can modify existing apps and scripts to produce colored sheet music.

<img src="./chromatic-scale.svg">

## Chromatic hand

The extension of the ancient method of linking finger phalanges and musical notes. We can make it consistent enough to use intuitively after a little practice.

<img src="./note-hand.svg">

## Integer notation adoption

Numbers are already widely used in music - they indicate rhythmic meters, interval sizes and scale steps. It may sound too much to use numbers for the actual notes, but it happens to be a nice way to make music even more easy to study. In any case nowadays music is stored in some kind of digital format. May be if we add colors to our music notation we can add the numbers without any confusion? So any properly colored number will have a distinct frequency to play (in 12-TET or beyond)?

<img src="./hand.svg">

## Colorful piano rolls

![](/media/apps/midi-roll.png)

Try the [MIDI-roll](/apps/midi/roll/) to look at incoming MIDI visualization.

![](/media/apps/roll.png)

Try the [Pitch-roll](/apps/pitch/roll/) to see the main note graph of incoming audio on an endless roll.

## Colorful spectrogram

Adding the colors to a regular spectrogram makes you see much more about the musical contents of any sound. You can easily see the fundamental pitch and the colors of all the main overtones for simple sounds.

![](/media/apps/spectrogram.png)

Try the [Colorful spectrogram](/apps/pitch/spectrogram/) online now.
