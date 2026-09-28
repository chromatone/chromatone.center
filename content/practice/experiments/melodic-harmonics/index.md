---
title: Melodic harmonics
description: Converting harmonic frequencies into temporal patterns
layout: iframe
date: 2026-06-06
cover: harmon.jpg
iframe: /demo/melodic-harmonics.html
standalone: true
---

# Melodic Harmonics

> Disassembling the harmonic series in time, space, and color.

An interactive installation that takes the harmonics of a sawtooth wave and **separates them rhythmically** — each harmonic becomes a concentric circle spinning at its own tempo, triggering its pitch as it passes the meridian. What is normally fused into a single timbral moment is unfolded into a polyrhythmic cascade you can see, hear, and understand.

---

## The Core Idea

A sawtooth wave is the sum of all integer harmonics:

$$f,\; 2f,\; 3f,\; 4f,\; 5f,\; 6f,\; 7f,\; 8f,\; \dots$$

Normally we hear them **simultaneously** — that's what makes a sawtooth sound like a sawtooth. The ear fuses them into one complex tone and we call it *timbre*.

This app **disassembles** them. Each harmonic gets its own circle, its own tempo, its own moment in time. Instead of hearing a single buzz, you hear the intervals emerge one by one:

- **1:1** — the tonic, grounding, slow
- **2:1** — the octave, familiar, twice as fast
- **3:2** — the perfect fifth, appearing as the 3rd harmonic
- **5:4** — the major third, the 5th harmonic's secret
- **7:4** — the harmonic seventh, that blue note between minor and major
- **8:1** — three octaves up, cycling back to the tonic

You don't just *learn* these ratios. You **feel** them arriving at different speeds, nested inside each other, building the architecture of a single pitch from the inside out.

---

## The Octave Rule: Pitch IS Tempo

The deepest insight this tool reveals is the **octave rule**:

> A frequency of 440 Hz and a tempo of 412.5 BPM are the same phenomenon, separated by octaves.

Every pitch class is also a rhythm class. A4 = 440 Hz. Drop it down six octaves: 440 ÷ 64 = 6.875 Hz = 412.5 BPM. The note *is* the tempo. The interval *is* the polyrhythm.

When you select a pitch class, the app computes two things from the same number:

| Domain | Calculation | Example (A) |
|--------|------------|-------------|
| **Pitch** | Frequency shifted to bass range (30–60 Hz) | A₁ ≈ 55 Hz |
| **Tempo** | Frequency × 60, shifted to ≤ 412.5 BPM | 412.5 BPM → fundamental at ~51 BPM |

The fundamental circle pulses every ~51 BPM (a slow, grounding bass note). The 8th harmonic spins at 412.5 BPM (fast enough to feel rhythmic urgency). All intermediate harmonics fill the space between.

**Pitch octave** and **tempo octave** controls shift these independently by ±2 octaves, letting you explore the same harmonic structure at different registers and speeds.

---

## What You See

- **Concentric circles** — outermost is the fundamental (harmonic 1), innermost is the highest harmonic. Each circle's radius is dynamically computed to fit all harmonics within the same visual space.
- **Tick marks** — harmonic *n* has *n* marks evenly distributed around its circle. This makes the integer ratio **visible**: the 3rd harmonic has 3 marks, the 5th has 5, the 7th has 7. You can literally *count* the ratio.
- **Colors** — each harmonic is colored by its Chromatone pitch class. The harmonic series naturally visits different notes: the 3rd harmonic is a fifth above the root, the 5th is a major third, the 7th is a flat seventh. The colors reveal this interval structure at a glance.
- **Radial grid** — faint sub-pixel lines and circles provide spatial reference without distraction.
- **The meridian** — a faint dashed line at 12 o'clock. When a harmonic's main dot crosses it, the sound triggers.

## What You Hear

- **Pure sine waves** at exact integer-ratio frequencies (just intonation, not equal temperament).
- **1/n amplitude scaling** — each harmonic is quieter than the last, matching the natural spectral envelope of a sawtooth wave. The fundamental dominates; upper harmonics shimmer.
- **Polyrhythmic layering** — at default tempo, the fundamental pulses every ~2 seconds while the 8th harmonic fires ~13 times per second. The space between is filled with 3-against-4-against-5-against-7 patterns.
- **Temporal blur** — at higher tempos, fast harmonics stop sounding like individual hits and fuse into a continuous tone. You are literally hearing the transition from rhythm to pitch.

---

## What This Reveals

### 1. Timbre is frozen rhythm
When harmonics fire fast enough, they stop being separate events and become a single complex tone. Speed up the tempo octave and watch (listen to) discrete pulses dissolve into timbre. Slow it down and timbre dissolves back into rhythm. There is no boundary — only octaves.

### 2. Intervals are ratios made audible
The 3rd harmonic doesn't play "a fifth." It plays the frequency that *is* 3/2 of the fundamental. In equal temperament we approximate this. Here you hear the **pure** 3:2, the **pure** 5:4, the **pure** 7:4. The difference is subtle but profound — pure intervals have a stillness, a lack of beating, that tempered intervals don't.

### 3. The harmonic series is a color progression
In Chromatone, A is red, E is azure, C♯ is green, G is magenta. The harmonic series on A visits: **red → red → azure → red → green → azure → magenta → red**. You see the interval structure as a color sequence. The 7th harmonic (magenta, a flat seventh) is the first "surprise" — the note that doesn't fit the major scale, the blue note hiding inside every pitched sound.

### 4. Nested periodicity is the structure of pitch
Each harmonic's period is an exact integer division of the fundamental's period. The 4th harmonic fires exactly 4 times per fundamental cycle. The 6th fires 6 times. This nesting is not a metaphor — it is the **physical reality** of what makes a pitched sound. The circles make this nesting visible as concentric rotation.

### 5. 8, 16, 32: diminishing returns of timbre
Switch to 32 harmonics. The outer 8 circles dominate your perception. The inner 24 add brightness and edge but the fundamental structure is already established by the first few harmonics. This is why a clarinet (odd harmonics only) sounds different from a sawtooth (all harmonics) — and why you can hear the difference by toggling the count.

---

## Controls

| Control | Options | Effect |
|---------|---------|--------|
| **Pitch** | A – G♯ (12 buttons) | Sets the root pitch class and its Chromatone color |
| **Pitch Octave** | −2 to +2 | Shifts the fundamental frequency by octaves |
| **Tempo Octave** | −2 to +2 | Shifts the fundamental tempo by octaves |
| **Harmonics** | 8 / 16 / 32 | Number of harmonics in the series |

Default state: **A**, pitch octave **+1**, tempo octave **−1**, **8** harmonics.

---

## Suggested Explorations

1. **Start with A, 8 harmonics, defaults.** Listen to the fundamental pulse. Count the marks on each circle. Hear how the 3rd harmonic (azure) arrives between fundamental beats.

2. **Switch to C.** The color progression changes: lime → lime → magenta → lime → azure → magenta → orange → lime. The 7th harmonic is now B♭ (orange) — a whole step below the tonic.

3. **Set harmonics to 32.** The inner circles spin fast. Listen to how the texture thickens. The outer 8 circles still anchor the rhythm.

4. **Drop tempo octave to −2.** Everything slows dramatically. You can now hear each harmonic as a distinct event. The polyrhythm becomes a meditation.

5. **Raise tempo octave to +2.** The inner harmonics blur into continuous tone. You are hearing the birth of timbre from rhythm.

6. **Compare 8 vs 16 vs 32 harmonics at the same tempo.** Notice how the "color" of the sound changes — more harmonics means brighter, more complex timbre. Fewer means purer, more fundamental.

7. **Try pitch octave −1.** The fundamental drops below 30 Hz. You may feel it more than hear it. The harmonics are now in the audible bass range. The interval relationships become physical vibrations in your body.

---

## Technical Notes

- **Self-contained** — single HTML file, no dependencies, no build step.
- **Web Audio API** — oscillators scheduled with sample-accurate timing via lookahead scheduler.
- **Just intonation** — frequencies are exact integer multiples of the fundamental (`n × f₁`), not equal-tempered approximations.
- **Chromatone color mapping** — each harmonic's interval in cents (`1200 × log₂(n)`) is mapped to the nearest 12-TET pitch class, then to its Chromatone color.
- **Pre-allocated typed arrays** — all audio and animation buffers are allocated once at startup for zero GC pressure during playback.
- **SVG rendering** — all 32 harmonic groups are pre-created and toggled via display. Radii are recalculated dynamically when the harmonic count changes.

