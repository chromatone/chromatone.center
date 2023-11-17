---
title: MIDI
description: Standard for digital music communication

date: 2021-09-12
cover: GM_Standard_Drum_Map_on_the_keyboard.svg
links:
  - https://www.scoringnotes.com/opinion/a-brief-history-of-music-notation-on-computers/
---

At the 1983 Winter NAMM Show, Smith demonstrated a MIDI connection between Prophet 600 and Roland JP-6 synthesizers. The MIDI specification was published in August 1983. The MIDI standard was unveiled by Kakehashi and Smith, who received Technical Grammy Awards in 2013 for their work. In 1982, the first instruments were released with MIDI, the Roland Jupiter-6 and the Prophet 600. In 1983, the first MIDI drum machine, the Roland TR-909, and the first MIDI sequencer, the Roland MSQ-700 were released. The first computer to support MIDI, the NEC PC-88 and PC-98, was released in 1982. The MIDI standard connected ground-breaking hardware like Yamaha’s DX7 synthesiser and Roland’s TR-909 drum machine.

![](./midi-notes.jpg)

A MIDI message is an instruction that controls some aspect of the receiving device. A MIDI message consists of a status byte, which indicates the type of the message, followed by up to two data bytes that contain the parameters. MIDI messages can be channel messages sent on only one of the 16 channels and monitored only by devices on that channel, or system messages that all devices receive. Each receiving device ignores data not relevant to its function.There are five types of message: Channel Voice, Channel Mode, System Common, System Real-Time, and System Exclusive.

![](./midi_data.gif)

Channel Voice messages transmit real-time performance data over a single channel. Examples include "note-on" messages which contain a MIDI note number that specifies the note's pitch, a velocity value that indicates how forcefully the note was played, and the channel number; "note-off" messages that end a note; program change messages that change a device's patch; and control changes that allow adjustment of an instrument's parameters. MIDI notes are numbered from 0 to 127 assigned to C−1 to G9. This corresponds to a range of 8.175799 to 12543.85 Hz (assuming equal temperament and 440 Hz A4) and extends beyond the 88 note piano range from A0 to C8. Middle C has the number 60. A4 (A440) – 69.

![svg](./GM_Standard_Drum_Map_on_the_keyboard.svg)

## MIDI clock

MIDI beat clock, or simply MIDI clock, is a clock signal that is broadcast via MIDI to ensure that several MIDI-enabled devices such as a synthesizer or music sequencer stay in synchronization. Clock events are sent at a rate of 24 pulses per quarter note. Those pulses are used to maintain a synchronized tempo for synthesizers that have BPM-dependent voices and also for arpeggiator synchronization.

MIDI beat clock differs from MIDI timecode in that MIDI beat clock is tempo-dependent.

Location information can be specified using MIDI Song Position Pointer (SPP, see below), although many simple MIDI devices ignore this message.
Messages

MIDI beat clock defines the following real-time messages:

- clock (decimal 248, hex 0xF8)
- start (decimal 250, hex 0xFA)
- continue (decimal 251, hex 0xFB)
- stop (decimal 252, hex 0xFC)

MIDI also specifies a System Common message called Song Position Pointer (SPP). SPP can be used in conjunction with the above realtime messages for complete sync. This message consists of 3 bytes; a status byte (decimal 242, hex 0xF2), followed by two 7-bit data bytes (least significant byte first) forming a 14-bit value which specifies the number of "MIDI beats" (1 MIDI beat = a 16th note = 6 clock pulses) since the start of the song. This message only needs to be sent once if a jump to a different position in the song is needed. Thereafter only realtime clock messages need to be sent to advance the song position one tick at a time.
