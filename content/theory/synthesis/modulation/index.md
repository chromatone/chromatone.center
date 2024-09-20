---
title: Modulation techniques
description: Signal cross relation
date: 2023-10-18
---

In electronics and telecommunications, modulation is the process of varying one or more properties of a periodic waveform, called the carrier signal, with a separate signal called the modulation signal that typically contains information to be transmitted. For example, the modulation signal might be an audio signal representing sound from a microphone, a video signal representing moving images from a video camera, or a digital signal representing a sequence of binary digits, a bitstream from a computer.


<youtube-embed video="XnoHXyb7dkY" />

This carrier wave usually has a much higher frequency than the message signal does. This is because it is impractical to transmit signals with low frequencies. Generally, to receive a radio wave one needs a radio antenna with length that is one-fourth of wavelength. For low frequency radio waves, wavelength is on the scale of kilometers and building such a large antenna is not practical. In radio communication, the modulated carrier is transmitted through space as a radio wave to a radio receiver.

Another purpose of modulation is to transmit multiple channels of information through a single communication medium, using frequency-division multiplexing (FDM). For example, in cable television (which uses FDM), many carrier signals, each modulated with a different television channel, are transported through a single cable to customers. Since each carrier occupies a different frequency, the channels do not interfere with each other. At the destination end, the carrier signal is demodulated to extract the information bearing modulation signal.

A modulator is a device or circuit that performs modulation. A demodulator (sometimes detector) is a circuit that performs demodulation, the inverse of modulation. A modem (from modulator–demodulator), used in bidirectional communication, can perform both operations. The lower frequency band occupied by the modulation signal is called the baseband, while the higher frequency band occupied by the modulated carrier is called the passband.[citation needed]

In analog modulation, an analog modulation signal is "impressed" on the carrier. Examples are amplitude modulation (AM) in which the amplitude (strength) of the carrier wave is varied by the modulation signal, and frequency modulation (FM) in which the frequency of the carrier wave is varied by the modulation signal. These were the earliest types of modulation[citation needed], and are used to transmit an audio signal representing sound in AM and FM radio broadcasting. More recent systems use digital modulation, which impresses a digital signal consisting of a sequence of binary digits (bits), a bitstream, on the carrier, by means of mapping bits to elements from a discrete alphabet to be transmitted. This alphabet can consist of a set of real or complex numbers, or sequences, like oscillations of different frequencies, so-called frequency-shift keying (FSK) modulation. A more complicated digital modulation method that employs multiple carriers, orthogonal frequency-division multiplexing (OFDM), is used in WiFi networks, digital radio stations and digital cable television transmission.

## Analog modulation methods

In analog modulation, the modulation is applied continuously in response to the analog information signal. Common analog modulation techniques include:

- Amplitude modulation (AM) (here the amplitude of the carrier signal is varied in accordance with the instantaneous amplitude of the modulating signal)
  - Double-sideband modulation (DSB)
    - Double-sideband modulation with carrier (DSB-WC) (used on the AM radio broadcasting band)
    - Double-sideband suppressed-carrier transmission (DSB-SC)
    - Double-sideband reduced carrier transmission (DSB-RC)
  - Single-sideband modulation (SSB, or SSB-AM)
    - Single-sideband modulation with carrier (SSB-WC)
    - Single-sideband modulation suppressed carrier modulation (SSB-SC)
  - Vestigial sideband modulation (VSB, or VSB-AM)
  - Quadrature amplitude modulation (QAM)
- Angle modulation, which is approximately constant envelope
  - Frequency modulation (FM) (here the frequency of the carrier signal is varied in accordance with the instantaneous amplitude of the modulating signal)
  - Phase modulation (PM) (here the phase shift of the carrier signal is varied in accordance with the instantaneous amplitude of the modulating signal)
  - Transpositional Modulation (TM), in which the waveform inflection is modified resulting in a signal where each quarter cycle is transposed in the modulation process. TM is a pseudo-analog modulation (AM). Where an AM carrier also carries a phase variable phase f(ǿ). TM is f(AM,ǿ)


## AM - Amplitude modulation

...

## FM - Frequency modulation

Frequency modulation synthesis (or FM synthesis) is a form of sound synthesis whereby the frequency of a waveform is changed by modulating its frequency with a modulator. The (instantaneous) frequency of an oscillator is altered in accordance with the amplitude of a modulating signal.

FM synthesis can create both harmonic and inharmonic sounds. To synthesize harmonic sounds, the modulating signal must have a harmonic relationship to the original carrier signal. As the amount of frequency modulation increases, the sound grows progressively complex. Through the use of modulators with frequencies that are non-integer multiples of the carrier signal (i.e. inharmonic), inharmonic bell-like and percussive spectra can be created.


<youtube-embed video="AzvxefRDT84" />

### Applications

FM synthesis using analog oscillators may result in pitch instability. However, FM synthesis can also be implemented digitally, which is more stable and became standard practice. Digital FM synthesis (equivalent to the phase modulation using the time integration of instantaneous frequency) was the basis of several musical instruments beginning as early as 1974. Yamaha built the first prototype digital synthesizer in 1974, based on FM synthesis, before commercially releasing the Yamaha GS-1 in 1980. The Synclavier I, manufactured by New England Digital Corporation beginning in 1978, included a digital FM synthesizer, using an FM synthesis algorithm licensed from Yamaha. Yamaha's groundbreaking Yamaha DX7 synthesizer, released in 1983, brought FM to the forefront of synthesis in the mid-1980s.

#### Amusement use: FM sound chips on PCs, arcades, game consoles, and mobile phones

FM synthesis also became the usual setting for games and software up until the mid-nineties. For IBM PC compatible systems, sound cards like the AdLib and Sound Blaster popularized Yamaha chips like the OPL2 and OPL3. Other computers such as the Sharp X68000 and MSX (Yamaha CX5M computer unit) use the OPM sound chip (which was also commonly used for arcade machines up to the mid-nineties) with later CX5M units using the OPP sound chip, and the NEC PC-88 and PC-98 computers use the OPN and OPNA. For arcade systems and game consoles, OPNB was used as main basic sound generator board in Taito's arcade boards (with a variant of the OPNB being used in the Taito Z System) and notably used in SNK's Neo Geo arcade (MVS) and home console (AES) machines. The related OPN2 was used in the Sega's Mega Drive (Genesis) and Fujitsu's FM Towns Marty as one of its sound generator chips. Throughout the 2000s, FM synthesis was also used on a wide range of phones to play ringtones and other sounds, typically in the Yamaha SMAF format.

<youtube-embed video="wn71QBApCRg" />

## History

### Don Buchla (mid-1960s)

Don Buchla implemented FM on his instruments in the mid-1960s, prior to Chowning's patent. His 158, 258 and 259 dual oscillator modules had a specific FM control voltage input,[7] and the model 208 (Music Easel) had a modulation oscillator hard-wired to allow FM as well as AM of the primary oscillator.[8] These early applications used analog oscillators, and this capability was also followed by other modular synthesizers and portable synthesizers including Minimoog and ARP Odyssey.

### John Chowning (late-1960s–1970s)

By the mid-20th century, frequency modulation (FM), a means of carrying sound, had been understood for decades and was being used to broadcast radio transmissions. FM synthesis was developed since 1967 at Stanford University, California, by John Chowning, who was trying to create sounds different from analog synthesis[citation needed]. His algorithm[citation needed] was licensed to Japanese company Yamaha in 1973. The implementation commercialized by Yamaha (US Patent 4018121 Apr 1977 or U.S. Patent 4,018,121) is actually based on phase modulation[citation needed], but the results end up being equivalent mathematically as both are essentially a special case of quadrature amplitude modulation[citation needed].

### 1970s–1980s

#### Expansions by Yamaha

Yamaha's engineers began adapting Chowning's algorithm for use in a commercial digital synthesizer, adding improvements such as the "key scaling" method to avoid the introduction of distortion that normally occurred in analog systems during frequency modulation[citation needed], though it would take several years before Yamaha released their FM digital synthesizers. In the 1970s, Yamaha were granted a number of patents, under the company's former name "Nippon Gakki Seizo Kabushiki Kaisha", evolving Chowning's work. Yamaha built the first prototype FM digital synthesizer in 1974. Yamaha eventually commercialized FM synthesis technology with the Yamaha GS-1, the first FM digital synthesizer, released in 1980.
FM digital synthesizer Yamaha DX7 (1983)

FM synthesis was the basis of some of the early generations of digital synthesizers, most notably those from Yamaha, as well as New England Digital Corporation under license from Yamaha. Yamaha's DX7 synthesizer, released in 1983, was ubiquitous throughout the 1980s. Several other models by Yamaha provided variations and evolutions of FM synthesis during that decade.

Yamaha had patented its hardware implementation of FM in the 1970s, allowing it to nearly monopolize the market for FM technology until the mid-1990s.

#### Related development by Casio

Casio developed a related form of synthesis called phase distortion synthesis, used in its CZ range of synthesizers. It had a similar (but slightly differently derived) sound quality to the DX series.

### 1990s

#### Popularization after the expiration of patent

With the expiration of the Stanford University FM patent in 1995, digital FM synthesis can now be implemented freely by other manufacturers. The FM synthesis patent brought Stanford $20 million before it expired, making it (in 1994) "the second most lucrative licensing agreement in Stanford's history". FM today is mostly found in software-based synths such as FM8 by Native Instruments or Sytrus by Image-Line, but it has also been incorporated into the synthesis repertoire of some modern digital synthesizers, usually coexisting as an option alongside other methods of synthesis such as subtractive, sample-based synthesis, additive synthesis, and other techniques. The degree of complexity of the FM in such hardware synths may vary from simple 2-operator FM, to the highly flexible 6-operator engines of the Korg Kronos and Alesis Fusion, to creation of FM in extensively modular engines such as those in the latest synthesisers by Kurzweil Music Systems.[citation needed]

#### Realtime Convolution & Modulation (AFM + Sample) and Formant Shaping Synthesis

New hardware synths specifically marketed for their FM capabilities disappeared from the market after the release of the Yamaha SY99 and FS1R, and even those marketed their highly powerful FM abilities as counterparts to sample-based synthesis and formant synthesis respectively. However, well-developed FM synthesis options are a feature of Nord Lead synths manufactured by Clavia, the Alesis Fusion range, the Korg Oasys and Kronos and the Modor NF-1. Various other synthesizers offer limited FM abilities to supplement their main engines.

Combining sets of 8 FM operators with multi-spectral wave forms began in 1999 by Yamaha in the FS1R. The FS1R had 16 operators, 8 standard FM operators and 8 additional operators that used a noise source rather than an oscillator as its sound source. By adding in tuneable noise sources the FS1R could model the sounds produced in the human voice and in a wind instrument, along with making percussion instrument sounds. The FS1R also contained an additional wave form called the Formant wave form. Formants can be used to model resonating body instrument sounds like the cello, violin, acoustic guitar, bassoon, English horn, or human voice. Formants can even be found in the harmonic spectrum of several brass instruments.

### 2000s–present

#### Variable Phase Modulation, FM-X Synthesis, Altered FM, etc

In 2016, Korg released the Korg Volca FM, a, 3-voice, 6 operators FM iteration of the Korg Volca series of compact, affordable desktop modules,. More recently Korg released the opsix (2020) and opsix SE (2023) integrating 6 operators FM synthesis with subtractive, analogue modeling, additive, semi-modular and Waveshaping. Yamaha released the Montage, which combines a 128-voice sample-based engine with a 128-voice FM engine. This iteration of FM is called FM-X, and features 8 operators; each operator has a choice of several basic wave forms, but each wave form has several parameters to adjust its spectrum. The Yamaha Montage was followed by the more affordable Yamaha MODX in 2018, with 64-voice, 8 operators FM-X architecture in addition to a 128-voice sample-based engine. Elektron in 2018 launched the Digitone, an 8-voice, 4 operators FM synth featuring Elektron's renowned sequence engine.

FM-X synthesis was introduced with the Yamaha Montage synthesizers in 2016. FM-X uses 8 operators. Each FM-X operator has a set of multi-spectral wave forms to choose from, which means each FM-X operator can be equivalent to a stack of 3 or 4 DX7 FM operators. The list of selectable wave forms includes sine waves, the All1 and All2 wave forms, the Odd1 and Odd2 wave forms, and the Res1 and Res2 wave forms. The sine wave selection works the same as the DX7 wave forms. The All1 and All2 wave forms are a saw-tooth wave form. The Odd1 and Odd2 wave forms are pulse or square waves. These two types of wave forms can be used to model the basic harmonic peaks in the bottom of the harmonic spectrum of most instruments. The Res1 and Res2 wave forms move the spectral peak to a specific harmonic and can be used to model either triangular or rounded groups of harmonics further up in the spectrum of an instrument. Combining an All1 or Odd1 wave form with multiple Res1 (or Res2) wave forms (and adjusting their amplitudes) can model the harmonic spectrum of an instrument or sound.

## Spectral analysis

There are multiple variations of FM synthesis, including:

- Various operator arrangements (known as "FM Algorithms" in Yamaha terminology)
  - 2 operators
  - Serial FM (multiple stages)
  - Parallel FM (multiple modulators, multiple-carriers),
  - Mix of them
- Various waveform of operators
  - Sinusoidal waveform
  - Other waveforms
- Additional modulation
  - Linear FM
  - Exponential FM (preceded by the anti-logarithm conversion for CV/oct. interface of analog synthesizers)
  - Oscillator sync with FM

etc.



