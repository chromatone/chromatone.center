---
title: Fretboard calculator
subtitle: A tool to get distances between frets for any scale length of any string instrument
tags: practice
date: 2021-04-09
cover: apps/fretboard.svg
instruments:
  Guitar:
    l: 650
    frets: 18
    tuning: [E2,A2,D3,G3,B3,E4]
  Electric guitar:
    l: 630
    frets: 22
    tuning: [E2,A2,D3,G3,B3,E4]
  Bass guitar:
    l: 860
    frets: 24
    tuning: [E1,A1,D2,G2]
  Mandolin:
    l: 360
    frets: 14
    tuning: [G4,D4,A5,E5]
  Mandola:
    l: 510
    frets: 16
    tuning: [C3,G3,D4,A4]
  Octave mandolin:
    l: 580
    frets: 18
    tuning: [G3,D3,A4,E4]
  Mandocello:
    l: 686
    frets: 20
    tuning: [C2,G2,D3,A3]
  Pipa:
    l: 900
    frets: 17
    tuning: [A2,D3,E3,A3]
  Balalaika (prima):
    l: 660
    frets: 20
    tuning: [E4,E3,A4]
  Ukulele (soprano):
    l: 330
    frets: 14
    tuning: [G4,C4,E4,A4]
  Ukulele (concert):
    l: 380
    frets: 16
    tuning: [G4,C4,E4,A4]
  Ukulele (tenor):
    l: 430
    frets: 18
    tuning: [G3,C4,E4,A4]
  Ukulele (baritone):
    l: 480
    frets: 20
    tuning: [D3,G3,B3,E4]
  Ukulele (bass):
    l: 510
    frets: 17
    tuning: [E2,A2,D3,G3]
  Banjo:
    l: 670
    frets: 17
    tuning: [G4,D3,G3,B3,D4]
  Violin:
    l: 330
    frets: 1
    tuning: [G3,D4,A4,E5]
  Cello:
    l: 700
    frets: 1
    tuning: [C2,G2,D3,A3]
  Viola:
    l: 420
    frets: 1
    tuning: [C3,G3,D4,A4]
  Double bass:
    l: 1100
    frets: 1
    tuning: [E1,A1,D2,G2]
---

<string-tool :instruments="$frontmatter.instruments" />
<svg-save svg="fretboard" />