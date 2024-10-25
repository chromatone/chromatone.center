---
title: Spectral synthesis
description: How to synthesise any sound with sine waves
links:
  - https://youtu.be/5g632XP7HVY?feature=shared
  - https://encyclopediaofmath.org/wiki/Spectral_synthesis
  - https://ccrma.stanford.edu/~jos/sasp/Spectral_Modeling_Synthesis.html
date: 2014-10-26
---


Spectral modeling synthesis (SMS) is an acoustic modeling approach for speech and other signals. SMS considers sounds as a combination of harmonic content and noise content. Harmonic components are identified based on peaks in the frequency spectrum of the signal, normally as found by the short-time Fourier transform. The signal that remains following removal of the spectral components, sometimes referred to as the residual, is then modeled as white noise passed through a time-varying filter. The output of the model, then, are the frequencies and levels of the detected harmonic components and the coefficients of the time-varying filter.

Intuitively, the model can be applied to many types of audio signals. Speech signals, for example, include slowly changing harmonic sounds caused by vibration of the vocal cords plus wideband, noise-like sounds caused by the lips and mouth. Musical instruments also produce sounds containing both harmonic components and percussive, noise-like sounds when the notes are struck or changed. 