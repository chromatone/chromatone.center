---
title: Karplus–Strong string
description: A method of physical modelling synthesis
date: 2023-11-14
cover: ksa.png
---

Karplus–Strong string synthesis is a method of physical modelling synthesis that loops a short waveform through a filtered delay line to simulate the sound of a hammered or plucked string or some types of percussion.

At first glance, this technique can be viewed as subtractive synthesis based on a feedback loop similar to that of a comb filter for z-transform analysis. However, it can also be viewed as the simplest class of wavetable-modification algorithms now known as digital waveguide synthesis, because the delay line acts to store one period of the signal.

Alexander Strong invented the algorithm, and Kevin Karplus did the first analysis of how it worked. Together they developed software and hardware implementations of the algorithm, including a custom VLSI chip. They named the algorithm "Digitar" synthesis, as a portmanteau for "digital guitar".

## How it works

![schema](./ksa.png)

- A short excitation waveform (of length L samples) is generated. In the original algorithm, this was a burst of white noise, but it can also include any wideband signal, such as a rapid sine wave chirp or frequency sweep, or a single cycle of a sawtooth wave or square wave.
- This excitation is output and simultaneously fed back into a delay line L samples long.
- The output of the delay line is fed through a filter. The gain of the filter must be less than 1 at all frequencies, to maintain a stable positive feedback loop. The filter can be a first-order lowpass filter (as pictured). In the original algorithm, the filter consisted of averaging two adjacent samples, a particularly simple filter that can be implemented without a multiplier, requiring only shift and add operations. The filter characteristics are crucial in determining the harmonic structure of the decaying tone.
- The filtered output is simultaneously mixed into the output and fed back into the delay line.

## Tuning the string

The fundamental frequency (specifically, the lowest nonzero resonant frequency) of the resulting signal is the lowest frequency at which the unwrapped phase response of the delay and filter in cascade is − 2 π -2\pi . The required phase delay D for a given fundamental frequency F0 is therefore calculated according to D = Fs/F0 where Fs is the sampling frequency.

The length of any digital delay line is a whole-number multiple of the sampling period. In order to obtain a fractional delay often needed for fine tuning the string below JND (Just Noticeable Difference), interpolating filters are used with parameters selected to obtain an appropriate phase delay at the fundamental frequency. Either IIR or FIR filters may be used, but FIR have the advantage that transients are suppressed if the fractional delay is changed over time. The most elementary fractional delay is the linear interpolation between two samples (e.g., s(4.2) = 0.8s(4) + 0.2s(5)). If the phase delay varies with frequency, harmonics may be sharpened or flattened relative to the fundamental frequency. The original algorithm used equal weighting on two adjacent samples, as this can be achieved without multiplication hardware, allowing extremely cheap implementations.

Z-transform analysis can be used to get the pitches and decay times of the harmonics more precisely, as explained in the 1983 paper that introduced the algorithm.

Holding the period (= length of the delay line) constant produces vibrations similar to those of a string or bell. Increasing the period sharply after the transient input produces drum-like sounds.

## Refinements to the algorithm

Due to its plucked-string sound in certain modes, Alex Strong and Kevin Karplus conjectured that the Karplus-Strong (KS) algorithm was in some sense a vibrating string simulation, and they worked on showing that it solved the wave equation for the vibrating string, but this was not completed.  Julius O. Smith III  recognized that the transfer-function of the KS, when viewed as a digital filter, coincided with that of a vibrating string, with the filter in the feedback loop representing the total string losses over one period. He later derived the KS algorithm as a special case of digital waveguide synthesis, which was used to model acoustic waves in strings, tubes, and membranes. The first set of extensions and generalizations of the Karplus-Strong Algorithm, typically known as the Extended Karplus-Strong (EKS) Algorithm, was presented in a paper in 1982 at the International Computer Music Conference in Venice, Italy, and published in more detail in 1983 in Computer Music Journal in an article entitled "Extensions of the Karplus Strong Plucked String Algorithm," by David A. Jaffe and Julius O. Smith, and in Smith's PhD/EE dissertation.

Alex Strong developed a superior wavetable-modification method for plucked-string synthesis, but only published it as a patent.

## Musical applications

The first musical use of the algorithm was in the work May All Your Children Be Acrobats written in 1981 by David A. Jaffe, and scored for eight guitars, mezzo-soprano and computer-generated stereo tape, with a text based on Carl Sandburg's The People, Yes. Jaffe continued to explore the musical and technical possibilities of the algorithm in Silicon Valley Breakdown, for computer-generated plucked strings (1982), as well as in later works such as Telegram to the President, 1984 for string quartet and tape, and Grass for female chorus and tape (1987).

The patent was licensed first to Mattel Electronics, which failed as a company before any product using the algorithm was developed, then to a startup company founded by some of the laid-off Mattel executives. They never got sufficient funding to finish development, and so never brought a product to market either. Eventually Yamaha licensed the patent, as part of the Sondius package of patents from Stanford. It is unknown whether any hardware using the algorithm was ever sold, though many software implementations (which did not pay any license fees to the inventors) have been released.

While they may not adhere strictly to the algorithm, many hardware components for modular systems have been commercially produced that invoke the basic principles of Karplus-Strong Synthesis: using an inverted, scaled control system for very small time values in a filtered delay line to create playable notes in the Western Tempered tuning system, controlled with volt per octave tracking or MIDI data. The Inventors were not specifically credited, though the term "Karplus-Strong Synthesis" is referenced in some of the manuals.

Hardware components capable of Karplus-Strong style synthesis include the Moog Clusterflux 108M, Mutable Instruments Elements and Rings, 4ms Company Dual Looping Delay, 2HP Pluck, Make Noise Mimeophon, Arturia MicroFreak and the Strymon Starlab.
