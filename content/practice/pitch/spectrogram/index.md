---
title: Spectrogram
description: Time-frequency audiovisual analysis tool
layout: iframe
iframe: https://spectrogram.chromatone.center
standalone: true
date: 2022-06-16
cover: spectrogram.png
usefulLinks:
  - https://codepen.io/hvianna/pen/ZEKWWJb
  - https://www.npmjs.com/package/audiomotion-analyzer
  - https://github.com/ListeningToWaves/SpectrogramTesting/blob/master/src/components/spectrogram.js
---

The colorful spectrogram is a powerful tool for visual audio analysis. Each particular frequency in the spectrum gets its own position on the vertical axis along with the corresponding Chromatone color. The pitch spectrum is continous and the graph shows all the partials in a rather high resolution. The colors of the lines help differentiate pitches and overtones in any incoming audio signal. The quality of analysis is based primarily on the quality of the signal – thus a good microphone is recommended for best experience.

## How to use the spectrogram

1. Drag across <i class="p-3 mr-1 i-la-hand-rock"></i> the spectrogram top change the roll speed. The actual setting is at the top-left corner.
2. Press the <i class="p-3 mr-1 i-la-expand"></i> icon at the bottom-right corner make the spectrogram go full screen. Very useful mode for deep explorations and teaching.
3. You can pause <i class="p-3 mr-1 i-la-pause"></i> and resume <i class="p-3 mr-1 i-la-play"></i> the roll either by clicking anywhere at the spectrogram or by pressing the `Spacebar` button on your keyboard. Useful when comparing two or more sound spectrums – record a sound spectrum on the roll, then pause it, take another instrument and record another. The roll can fit up to 10 segments or even more.
4. Clear the canvas with the <i class="p-3 mr-1 i-la-trash-alt"></i> button at the top-right corner or by pressing the `Enter` button on your keyboard.
5. CONTRAST control changes the steepness to which we raise the value of each band. It accentuates louder frequencies and dampens noise.
6. MIDPOINT control is for tuning the values before the raising to the power. It can help adjust the brightness and sensitivity of the spectroscope.
7. Right click the small video to open the spectrogram in Picture-In-Picture mode. You may need to press play in the floating window to see the spectrogram running.


=====

### The Geometry of Sound: Visualizing What We Actually Hear

Sound is the most invisible of mediums. It exists as ripples in the air, washing over us and vanishing into the past. For centuries, musicians and scientists have sought to pin it down—to freeze it in place so we can look at it, study it, and understand its geometry. 

The tool we usually use for this is the spectrogram. But traditional spectrograms have a problem: they are built on math that prioritizes computational convenience over human truth. They show us what the sound wave *is*, not what we *hear*. 

In rebuilding the Chromatone Spectrogram, we asked a simple question: What if we build a visualizer that doesn't just measure sound, but perceives it? Here is the story of how we married the strict mathematics of music with the messy, beautiful biology of the human ear.

#### The Illusion of Averages
When a computer analyzes sound, it chops it into frequencies using a mathematical operation called the Fast Fourier Transform (FFT). Traditionally, the computer takes all the frequencies inside a musical note's pitch range and averages them together to draw a pixel.

But nature doesn't do averages. If you whistle a pure, high note while a low bass hums in the background, your ear doesn't blur them together. The cochlea—the spiral organ in your inner ear—acts like a piano keyboard: specific hairs catch specific frequencies. If a hair cell catches a strong signal, it actually *suppresses* its neighbors so you hear the pitch more clearly. 

To mimic this, we abandoned averaging. Instead, our algorithm uses **Peak-Picking**. It looks at a frequency band and only keeps the loudest, sharpest signal it finds. Then, we apply **Lateral Inhibition**—a biological algorithm that mathematically suppresses neighboring pixels if one is much brighter. The result? Overlapping harmonics suddenly separate into razor-sharp ridges, exactly as they do in your auditory nerve.

#### The Tyranny of Linear Math
Another deception of traditional spectrograms is how they measure loudness. Computers measure amplitude linearly: a sound wave twice as tall is twice as loud. But human hearing is logarithmic. To us, doubling the physical energy of a sound only makes it slightly louder. 

If we visualize linear math, quiet harmonics disappear into blackness, and loud bass notes blow out into pure white. We had to move the entire visual pipeline into a **Perceptual dB (decibel) Scale**. By mapping the quietest audible noise (0 dB) to black, and the threshold of pain (100 dB) to white, we compress the dynamic range. Suddenly, the whisper-quiet high frequencies of a breathy flute appear right alongside the booming low frequencies of a kick drum, both visible, neither overwhelming the other.

#### The Problem with Time
A spectrogram has two axes: frequency (up and down) and time (left to right). When you scroll a spectrogram at normal speed (1x), it's easy. But what if you want to slow it down to study a fast trill, or speed it up to see a whole song?

In a GPU, scrolling means writing new lines of pixels into a texture. If your speed is 1, you write one line per frame. If your speed is 4, you write four lines. But what happens if your speed is 0.5? You can't write half a pixel. Traditional spectrograms "step," causing a jittery, blocky mess. 

We solved this by completely decoupling time from the screen. We accumulate the fractional speed in the background. When we need to write a new line, we use **Temporal Interpolation**—we fade the previous audio frame into the current audio frame, creating artificial "in-between" frames. On the visual side, we tell the GPU to scroll by a *fraction* of a pixel, using sub-pixel rendering to smooth out the gaps. Time can now stretch and compress like liquid, without losing a single crisp detail.

#### Carving the Topography
Even with perfect data, screens are inherently blurry. When you stretch a small image across a large monitor, the graphics card uses "bilinear filtering"—it blurs adjacent pixels together to prevent jagged edges. But in a spectrogram, this blurs our hard-won harmonic ridges into smudges.

We fought the GPU's blur with a **5-Tap Unsharp Mask**. For every pixel we draw, the shader sneakily samples the four pixels around it. If the center pixel is brighter than its surroundings, the shader mathematically subtracts the blur, amplifying the edge. 

Finally, we borrowed a trick from cartography. If you look at a physical relief map of a mountain range, the elevation is shown with contour lines (isobars). We added a tiny algorithm that introduces microscopic steps in the brightness curve, creating **Topographic Isobars**. It tricks the human eye into seeing hyper-defined boundaries between pitches, completely eliminating the "LCD smudge" effect of modern displays.

#### A Mirror for the Ear
We didn't build this just to make pretty colors. We built it because the tools we use shape the way we think. When you look at a standard spectrogram, you are looking at a compromise—a flattened, averaged, blurry representation of a living sound.

By grounding our math in biology—mimicking the cochlea's frequency bands, the ear's logarithmic response, the nerve's lateral inhibition—we aren't just visualizing sound anymore. We are building a mirror. We are translating the invisible, fleeting ripples of the air into a true reflection of human perception. 

This is what sound actually looks like.