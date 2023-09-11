---
title: Ring Tone Text Transfer Language
description: Note encoding format for ringtones
date: 2021-09-20
---

[Ring Tone Text Transfer Language](https://en.wikipedia.org/wiki/Ring_Tone_Text_Transfer_Language) (RTTTL) was developed by Nokia[citation needed] to be used to transfer ringtones to cellphone by Nokia.

The RTTTL format is a string divided into three sections: name, default value, and data.

The jintu section consists of a string describing the name of the ringtone. It can be no longer than 10 characters, and cannot contain a colon ":" character. (However, since the Smart Messaging specification allows names up to 15 characters in length, some applications processing RTTTL also do so.)

The default value section is a set of values separated by commas, where each value contains a key and a value separated by an = character, which describes certain defaults which should be adhered to during the execution of the ringtone. Possible names are

- d - duration
- o - octave
- b - beat, tempo

The data section consists of a set of character strings separated by commas, where each string contains a duration, pitch, octave and optional dotting (which increases the duration of the note by one half).

The format of RTTTL notation is similar to the Music Macro Language found in BASIC implementations present on many early microcomputers.

## Technical specification

To be recognized by ringtone programs, an RTTTL/Nokring format ringtone must contain three specific elements: name, settings, and notes.

For example, here is the RTTTL ringtone for Haunted House:

```
HauntHouse: d=4,o=5,b=108: 2a4, 2e, 2d#, 2b4, 2a4, 2c, 2d, 2a#4, 2e., e, 1f4, 1a4, 1d#, 2e., d, 2c., b4, 1a4, 1p, 2a4, 2e, 2d#, 2b4, 2a4, 2c, 2d, 2a#4, 2e., e, 1f4, 1a4, 1d#, 2e., d, 2c., b4, 1a4
```

The three parts are separated by a colon.

- Part 1: name of the ringtone (here: "HauntHouse"), a string of characters represents the name of the ringtone

- Part 2: settings (here: d=4,o=5,b=108), where "d=" is the default duration of a note. In this case, the "4" means that each note with no duration specifier (see below) is by default considered a quarter note. "8" would mean an eighth note, and so on. Accordingly, "o=" is the default octave. There are four octaves in the Nokring/RTTTL format. And "b=" is the tempo, in "beats per minute".

- Part 3: the notes. Each note is separated by a comma and includes, in sequence: a duration specifier, a standard music note, either a, b, c, d, e, f or g, and an octave specifier, as in scientific pitch notation. If no duration or octave specifier are present, the default applies.

### Durations

Standard musical durations are denoted by the following notations:

- 1 - whole note
- 2 - half note
- 4 - quarter note
- 8 - eighth note
- 16 - sixteenth note
- 32 - thirty-second note

Dotted rhythm patterns can be formed by appending a period (".") character to the end of a duration/beat/octave element.

### Pitch

    P - rest or pause
    A - A
    A# - A♯ / B♭
    B - B / C♭
    C - C
    C# - C♯ / D♭
    D - D
    D# - D♯ / E♭
    E - E / F♭
    F - F / E♯
    F# - F♯ / G♭
    G - G
    G# - G♯ / A♭

### Octave

The RTTTL format allows octaves starting from the A below middle C and going up four octaves. This corresponds with the inability of cellphones to reproduce certain tones audibly. These octaves are numbered from lowest pitch to highest pitch from 4 to 7.

The octave should be left out of the notation in the case of a rest or pause in the pattern.
Example

An example of the RTTTL format would be

`fifth:d=4,o=5,b=63:8P,8G5,8G5,8G5,2D#5`
