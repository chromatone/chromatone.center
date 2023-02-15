/**
 * @module MIDI
 */

import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, computed, watchEffect, onMounted, ref, watch } from 'vue'

import { WebMidi, Note, Forwarder, ControlChangeMessageEvent, } from "webmidi"
import type { Input, Output, Event, Message, MessageEvent, InputChannel } from 'webmidi'
import { setupKeyboard } from './keyboard'
import Ola from "ola";

export interface MidiInterface {
  enabled: boolean
  initiated: boolean
  playing: boolean
  stopped: boolean | number
  keyboard: boolean
  out: boolean
  inputs: Record<string, {
    name: string,
    manufacturer: string,
    forwarder: Forwarder,
    clock: number,
    note: ChromaNote,
    cc: {
      channel: number
      timestamp: number
      number: number
      value: number
      raw: number
      port: string
    },
    diff?: number
    bpm?: number
    event?: Event
  }>
  outputs: Record<string, {
    name: string
    manufacturer: string
  }>
  forwards: Record<string, Record<string, boolean>>
  channels: Record<number, { notes: {}, activeNotes: {}, cc: {} }>
  activeNotes: Record<number, boolean>
  note: {
    pitch: number
    channel: number
    velocity?: number
    number?: number
  }
  cc?: {
    channel?: number
    number?: number
    value?: number
  }
  offset: number
  time?: number
  clock?: number
  log: MessageEvent[]
  message: Message
  filter?: {}
  channel: number
  stopAll: Function
  attack: Function,
  release: Function,
  once: Function,
  setCC: Function,
}

export const midi: MidiInterface = reactive({
  enabled: false,
  initiated: false,
  playing: false,
  stopped: false,
  out: true,
  inputs: {},
  outputs: {},
  forwards: {},
  channels: {},
  channel: useStorage("global-midi-channel", 1),
  note: {
    pitch: 0,
    channel: 1,
    velocity: 0,
  },
  offset: useClamp(0, -2, 2),
  keyboard: true,
  cc: {},
  ccLearn: {},
  message: null,
  log: [],
  clock: 0,
  filter: useStorage("global-midi-filter", {}),
  available: computed(() => Object.entries(midi.outputs).length > 0),
  activeNotes: computed((): { [key: number]: boolean } => {
    let notes = {}
    for (let ch in midi.channels) {
      for (let num in midi.channels[ch].activeNotes) {
        notes[num] = midi.channels[ch].activeNotes[num]
      }
    }
    return notes
  }),
  activeChroma: computed((): number[] => {
    let chroma = new Array(12)
    for (let num in midi.activeNotes) {
      const n = (Number(num) - 9) % 12
      chroma[n] = num
    }
    return chroma
  }),
  stopAll,
  attack: midiAttack,
  release: midiRelease,
  once: midiOnce,
  setCC
});

export function learnCC({ number, channel }: {
  number: number
  channel: number
}) {
  const val = ref(0)
  watch(() => midi.cc, cc => {
    if (channel && cc.channel != channel) return
    if (number == cc.number)
      val.value = cc.value;
  })
  return val
}

export function playKey(name: string, offset = 0, off?: boolean, velocity: number = 1, duration?: number) {
  let noteName = name + (4 + offset + midi.offset)
  const note = new Note(noteName, {
    attack: off ? 0 : velocity,
    release: off ? 0 : velocity,
    duration
  });
  const ev = {
    type: off ? "noteoff" : "noteon",
    note,
    port: { id: "PC Keyboard" } as Input,
    timestamp: midi.time,
    target: { number: 0 } as InputChannel,
    channel: 0,
    message: {} as Message
  };
  noteInOn(ev);
}

export function useMidi() {
  if (!midi.initiated) {

    onMounted(() => {
      setupKeyboard()
      if (WebMidi.supported) {
        setupMidi();
      }
    });

    watchEffect(() => {
      if (!midi.out) return;
      let outs = Object.values(WebMidi.outputs);
      if (midi.playing) {
        outs.forEach((output) => {
          output.sendContinue();
        });
      } else {
        outs.forEach((output) => {
          output.sendStop();
        })
      }
    });
    midi.stopped = false
    midi.initiated = true;
  }


  return {
    midi,
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    midiPlay,
    midiStop
  };
}

function setupMidi() {

  WebMidi.enable();
  WebMidi.addListener("enabled", () => {
    midi.enabled = true;
    initMidi();
  });

  // let interval = setInterval(() => {
  //   initMidi();
  // }, 3000);

  WebMidi.addListener("connected", () => {
    initMidi();
  });

  WebMidi.addListener("disconnected", (e) => {
    delete midi[e.port.type + "s"][e.port.id];
  });
  midi.initiated = true;
}

function initMidi() {
  midi.inputs = reactive({});

  WebMidi.inputs.forEach((input) => {
    midi.enabled = true;
    midi.inputs[input.id] = {
      name: input.name,
      manufacturer: input.manufacturer,
      //@ts-expect-error We configure the output later
      forwarder: input.addForwarder(),
      clock: 0,
      event: null,
      note: null,
      cc: null,
    };
    input.removeListener();
    input.addListener("start", () => {
      midi.playing = true;
      midi.stopped = false
    });
    input.addListener("stop", () => {
      midi.playing = false;
      midi.stopped = Date.now()
    });

    const diffs = []
    const avg = Ola({ value: 15 })

    input.addListener('clock', ev => {
      const diff = ev.timestamp - midi.inputs[input.id].clock
      diffs.push(diff)

      if (diffs.length > 50) diffs.shift()
      avg.value = diffs.reduce((acc, d) => acc + d, 0) / diffs.length
      midi.inputs[input.id].diff = avg.value;
      midi.inputs[input.id].bpm = (1000 / avg.value / 24) * 60
      midi.inputs[input.id].clock = ev.timestamp;

    })

    input.addListener("midimessage", (ev) => {
      if (ev?.message?.type == "clock") return

      midi.inputs[input.id].event = ev;
      midi.message = ev.message;
      midi.log.unshift(ev);
      if (midi.log.length > 100) midi.log.pop();
    });
    input.addListener(
      "noteon",
      (ev) => {
        midi.inputs[input.id].note = noteInOn(ev);
      }
    );
    input.addListener(
      "noteoff",
      (ev) => {
        midi.inputs[input.id].note = noteInOn(ev);
      }
    );

    input.addListener(
      "controlchange",
      (ev) => {
        const cc = ccIn(ev);
        if (!cc) return;
        midi.inputs[input.id].cc = cc;
        midi.cc = cc;
      }
    );

    input.addListener("clock", (ev) => {
      midi.clock = ev.timestamp;
      //bpm = 60000 / ((ev.timestamp - prevTimestamp) * PPQ)  ppq=24
    });
  });

  midi.outputs = reactive({});
  WebMidi.outputs.forEach((output) => {
    midi.outputs[output.id] = {
      name: output.name,
      manufacturer: output.manufacturer,
    };
  });
}

export interface NoteMessageEvent extends MessageEvent {
  channel: number;
  note: Note;
  port: Input;
  target: Input | InputChannel;
}

export interface ChromaNote {
  port: string
  type: string
  timestamp: number
  channel: number
  number: number
  velocity: number
  pitch: number
  octA: number
}

function noteInOn(ev: NoteMessageEvent) {

  const note: ChromaNote = {
    ...ev.note,
    port: ev.port.id,
    type: ev.type,
    timestamp: ev.timestamp,
    //@ts-expect-error type bug?
    channel: ev.target.number,
    velocity: 0,
    number: ev.note.number,
    pitch: (ev.note.number + 3) % 12,
    octA: Math.floor((ev.note.number + 3) / 12) - 1,
  };

  if (midi.filter[note.channel]) return;
  createChannel(note.channel);
  midi.channels[note.channel].notes[note.number] = note;
  if (ev.type == "noteoff") {
    note.velocity = 0;
    delete midi.channels[note.channel].activeNotes[note.number]
  } else {
    note.velocity = 120 * (ev.note.attack || 1);
    midi.channels[note.channel].activeNotes[note.number] = true
  }
  midi.note = note;
  return note;
}


function ccIn(ev: ControlChangeMessageEvent): {
  channel: number
  timestamp: number
  number: number
  value: number
  raw: number
  port: string
} {
  if (midi.filter[ev.controller.number]) return;
  let cc = {
    channel: ev.controller.number,
    timestamp: ev.timestamp,
    number: ev.controller.number,
    value: Number(ev.value),
    raw: ev.rawValue,
    port: ev.port.id,
  };
  createChannel(cc.channel);
  midi.channels[cc.channel].cc[cc.number] = cc;
  return cc;
}

function createChannel(ch: number) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = reactive({ num: ch, activeNotes: {}, notes: {}, cc: {} });
  }
}

function setVelocity(channel: number, note: string | number, velocity: number) {
  if (midi.channels?.[channel]?.notes?.[note]) {
    midi.channels[channel].notes[note].velocity = velocity;
  }
}

export function midiAttack(note: { channel: number; number: string | number }, options: { channels?: number | number[]; duration?: number; attack?: number; rawAttack?: number; release?: number; rawRelease?: number; time?: string | number; }) {
  if (!midi.out) return;
  let channel = note?.channel || midi.channel;
  setVelocity(channel, note?.number, 100);
  WebMidi.outputs.forEach((output) => {
    output.playNote(note.number, {
      channels: channel,
      ...options,
    });
  });
}

export function midiPlay(
  note: string | number | number[] | Note | string[] | Note[],
  options?: {
    duration?: number;
    attack?: number;
    channels?: number | number[];
    rawAttack?: number;
    release?: number;
    rawRelease?: number;
    time?: string | number;
  }) {
  if (!midi.out) return;
  WebMidi.outputs.forEach((output) => {
    console.log(note, options)
    output.playNote(note, {
      channels: midi.channel,
      ...options,
    });
  });
}

export function midiStop(note?: string | number | number[] | Note | string[] | Note[], options?: { channels?: number | number[]; release?: number; rawRelease?: number; time?: string | number; }) {
  if (!midi.out) return;
  if (note) {
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note, { channels: midi.channel, ...options });
    });
  } else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
    midi.stopped = true
  }
}

export function midiRelease(note: { channel: number; number: string | number }) {
  if (!midi.out) return;
  if (note) {
    let channel = note?.channel || midi.channel;
    setVelocity(channel, note?.number, 0);
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note.number, { channels: channel });
    });
  } else {
    WebMidi.outputs.forEach((output) => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
  }
}

export function midiOnce(note: string | number | number[] | Note | string[] | Note[], options?: { duration?: number; attack?: any; channels: number | number[]; rawAttack?: number; release: number; rawRelease: number; time: string | number; }) {
  if (!midi.out || midi.filter[midi.channel]) return;
  midiPlay(note, options);
  setTimeout(() => {
    midiStop(note, options);
  }, 300);
}

export function setCC(cc: { number: number | string; channel: { channels?: number | number[]; time?: string | number; }; }, value: number) {
  if (!midi.out) return;
  WebMidi.outputs.forEach((output) => {
    output.sendControlChange(Number(cc.number), value, cc.channel);
  });
}

export function stopAll() {
  if (!midi.out) return;
  midi.channels = {};
  midi.playing = false;
  WebMidi.outputs.forEach((output) => {
    output.sendAllNotesOff();
    output.sendAllSoundOff();
    output.sendReset();
    output.sendSongPosition(0)
  });
  midi.stopped = true
}
/**
 * Sets a forwarding route from an Input to an Output
 * @param iid Input ID
 * @param oid Output ID
 */
export function forwardMidi(iid: string, oid: string) {
  const output = WebMidi.outputs.find((out) => out.id == oid);
  const destinations = midi.inputs[iid].forwarder.destinations;
  const index = destinations.indexOf(output);

  if (index == -1) {
    destinations.push(output);
    midi.forwards[iid] = midi.forwards[iid] || {};
    midi.forwards[iid][oid] = true;
  } else {
    destinations.splice(index, 1);
    delete midi.forwards?.[iid]?.[oid];
  }
}


export function sortNotes(notes: Note, reverse = false) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    let diff = a.number > b.number ? -1 : 1
    if (reverse) {
      diff *= -1
    }
    return diff
  })
}