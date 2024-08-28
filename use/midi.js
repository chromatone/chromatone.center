/**
 * @module MIDI
 */
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, computed, watchEffect, onMounted, ref, watch, shallowReactive } from 'vue';
import { WebMidi, Note } from "webmidi";
import { setupKeyboard } from './keyboard';
import Ola from "ola";
import { Chord, Midi } from 'tonal';
import { setTimeout } from 'worker-timers';

const MIDI_CHANNEL_STORAGE_KEY = "global-midi-channel";
const MIDI_FILTER_STORAGE_KEY = "global-midi-filter";

export const midi = reactive({
  enabled: false,
  initiated: false,
  playing: false,
  stopped: false,
  out: true,
  inputs: shallowReactive({}),
  outputs: shallowReactive({}),
  forwards: {},
  channels: {},
  channel: useStorage(MIDI_CHANNEL_STORAGE_KEY, 1),
  note: { pitch: 0, channel: 1, velocity: 0 },
  offset: useClamp(0, -3, 3),
  keyboard: true,
  cc: {},
  ccLearn: {},
  message: null,
  log: [],
  clock: 0,
  filter: useStorage(MIDI_FILTER_STORAGE_KEY, {}),
  available: computed(() => Object.keys(midi.outputs).length > 0),
  activeNotes: computed(() => {
    return Object.values(midi.channels).reduce((acc, channel) => {
      return { ...acc, ...channel.activeNotes };
    }, {});
  }),
  guessChords: computed(() => {
    const list = Object.keys(midi.activeNotes).map(n => Midi.midiToNoteName(Number(n), { sharps: true }));
    return list.length > 2 ? Chord.detect(list) : [];
  }),
  activeChroma: computed(() => {
    const chroma = new Array(12).fill(0);
    Object.keys(midi.activeNotes).forEach(num => {
      const n = (Number(num) - 9) % 12;
      chroma[n] = 1;
    });
    return chroma.join('');
  }),
  activeChromaMidi: computed(() => {
    const chroma = new Array(12).fill(0);
    Object.keys(midi.activeNotes).forEach(num => {
      const n = (Number(num) - 9) % 12;
      chroma[n] = Number(num);
    });
    return chroma;
  }),
  stopAll,
  attack: midiAttack,
  release: midiRelease,
  once: midiOnce,
  setCC
});

export function learnCC({ number, channel }) {
  const val = ref(0);
  watch(() => midi.cc, cc => {
    if ((!channel || cc.channel === channel) && number === cc.number) {
      val.value = cc.value;
    }
  });
  return val;
}

export function playKey(name = 'A', offset = 0, off = false, velocity = 1, duration) {
  noteInOn({
    type: off ? "noteoff" : "noteon",
    note: new Note(`${name}${4 + offset + midi.offset}`, {
      attack: off ? 0 : velocity,
      release: off ? 0 : velocity,
      duration
    }),
    port: { id: "Chromatone.center" },
    timestamp: midi.time,
    target: { number: 0 },
    channel: 0,
    message: {}
  })
}

export function useMidi() {
  if (!midi.initiated) {
    onMounted(() => {
      setupKeyboard();
      setupMidi();
    });
    watchEffect(() => {
      if (!midi.out) return;
      const action = midi.playing ? 'sendContinue' : 'sendStop';
      Object.values(WebMidi.outputs).forEach(output => output[action]());
    });
    midi.stopped = false;
    midi.initiated = true;
  }
  return {
    midi,
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    midiPlay,
    midiStop,
    playKey,
    stopAll
  };
}

async function checkMidiPermission() {
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'midi', sysex: true });
      result.addEventListener('change', ev => console.log(ev))
      if (result.state === 'granted') {
        console.log('MIDI permission already granted');
        return true;
      } else if (result.state === 'prompt') {
        console.log('MIDI permission will be requested');
        return null;
      } else {
        console.log('MIDI permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error checking MIDI permission:', error);
    }
  }
  return null; // Permission API not supported
}


async function setupMidi() {
  const permissionStatus = await checkMidiPermission();
  if (permissionStatus === false) {
    console.error("MIDI permission denied. Please enable MIDI access in your browser settings.");
    return;
  }
  try {
    await WebMidi.enable({ sysex: true });
    midi.enabled = true;
    initMidi();
    WebMidi.addListener("connected", initMidi);
    WebMidi.addListener("disconnected", handleDisconnect);
  } catch (err) {
    console.error("Failed to enable WebMidi:", err);
  }
}

function initMidi() {
  midi.enabled = true;
  WebMidi.inputs.forEach(setupInput);
  WebMidi.outputs.forEach(setupOutput);
}

function setupInput(input) {
  midi.inputs[input.id] = {
    name: input.name,
    manufacturer: input.manufacturer,
    forwarder: input.addForwarder(),
    clock: 0,
    event: null,
    note: null,
    cc: null,
  };

  input.removeListener();
  setupInputListeners(input);
}

function setupInputListeners(input) {
  const listeners = {
    start: () => { midi.playing = true; midi.stopped = false; },
    stop: () => { midi.playing = false; midi.stopped = Date.now(); },
    clock: handleClock(input),
    midimessage: handleMidiMessage(input),
    noteon: ev => midi.inputs[input.id].note = noteInOn(ev),
    noteoff: ev => midi.inputs[input.id].note = noteInOn(ev),
    controlchange: handleControlChange(input),
  };

  Object.entries(listeners).forEach(([event, handler]) => {
    input.addListener(event, handler);
  });
}

function handleClock(input) {
  const diffs = [];
  const avg = Ola({ value: 15 });
  return ev => {
    const diff = ev.timestamp - midi.inputs[input.id].clock;
    diffs.push(diff);
    if (diffs.length > 50) diffs.shift();
    avg.value = diffs.reduce((acc, d) => acc + d, 0) / diffs.length;
    midi.inputs[input.id].diff = avg.value;
    midi.inputs[input.id].bpm = (1000 / avg.value / 24) * 60;
    midi.inputs[input.id].clock = ev.timestamp;
  };
}

function handleMidiMessage(input) {
  return ev => {
    if (ev?.message?.type === "clock") return;
    midi.inputs[input.id].event = ev;
    midi.message = ev.message;
    midi.log.unshift(ev);
    if (midi.log.length > 100) midi.log.pop();
  };
}

function handleControlChange(input) {
  return ev => {
    const cc = ccIn(ev);
    if (!cc) return;
    midi.inputs[input.id].cc = cc;
    midi.cc = cc;
  };
}

function setupOutput(output) {
  midi.outputs[output.id] = {
    name: output.name,
    manufacturer: output.manufacturer,
  };
}

function handleDisconnect(e) {
  delete midi[`${e.port.type}s`][e.port.id];
}

function noteInOn(ev) {
  const note = {
    ...ev.note,
    port: ev.port.id,
    type: ev.type,
    timestamp: ev.timestamp,
    channel: ev.target.number,
    velocity: 0,
    number: ev.note.number,
    pitch: (ev.note.number + 3) % 12,
    octA: Math.floor((ev.note.number + 3) / 12) - 1,
  };
  if (midi.filter[note.channel]) return;
  createMidiChannel(note.channel);
  midi.channels[note.channel].notes[note.number] = note;
  if (ev.type === "noteoff") {
    note.velocity = 0;
    delete midi.channels[note.channel].activeNotes[note.number];
  } else {
    note.velocity = 120 * (ev.note.attack || 1);
    midi.channels[note.channel].activeNotes[note.number] = ev.note.attack;
  }
  midi.note = note;
  return note;
}

function ccIn(ev) {
  if (midi.filter[ev.message.channel]) return;
  const cc = {
    channel: ev.message.channel,
    timestamp: ev.timestamp,
    number: ev.controller.number,
    value: Number(ev.value),
    raw: ev.rawValue,
    port: ev.port.id,
  };
  createMidiChannel(cc.channel);
  midi.channels[cc.channel].cc[cc.number] = cc;
  return cc;
}

function createMidiChannel(ch) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = reactive({ num: ch, activeNotes: {}, notes: {}, cc: {} });
  }
}

function setVelocity(channel, note, velocity) {
  midi.channels[channel].notes[note].velocity = velocity;
}

export function midiAttack(note, options, velocity = 100) {
  if (!midi.out) return;
  const channel = note?.channel || midi.channel;
  setVelocity(channel, note?.number, velocity);
  WebMidi.outputs.forEach(output => {
    output.playNote(note.number, { channels: channel, ...options });
  });
}

export function midiPlay(note, options) {
  if (!midi.out) return;
  WebMidi.outputs.forEach(output => {
    output.playNote(note, { channels: midi.channel, ...options });
  });
}

export function midiStop(note, options) {
  if (!midi.out) return;
  if (note) {
    WebMidi.outputs.forEach(output => {
      output.stopNote(note, { channels: midi.channel, ...options });
    });
  } else {
    WebMidi.outputs.forEach(output => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
    midi.stopped = true;
  }
}

export function midiRelease(note) {
  if (!midi.out) return;
  if (note) {
    const channel = note?.channel || midi.channel;
    setVelocity(channel, note?.number, 0);
    WebMidi.outputs.forEach(output => {
      output.stopNote(note.number, { channels: channel });
    });
  } else {
    WebMidi.outputs.forEach(output => {
      output.sendAllNotesOff();
      output.sendAllSoundOff({ time: "+1" });
    });
  }
}

export function midiOnce(note, options) {
  if (!midi.out || midi.filter[midi.channel]) return;
  midiPlay(note, options);
  setTimeout(() => {
    midiStop(note, options);
  }, 300);
}

export function setCC(cc, value) {
  if (!midi.out) return;
  WebMidi.outputs.forEach(output => {
    output.sendControlChange(Number(cc.number), value, cc.channel);
  });
}

export function stopAll() {
  if (!midi.out) return;
  midi.channels = {};
  midi.playing = false;
  WebMidi.outputs.forEach(output => {
    output.sendAllNotesOff();
    output.sendAllSoundOff();
    output.sendReset();
    output.sendSongPosition(0);
  });
  midi.stopped = true;
}

export function forwardMidi(iid, oid) {
  const output = WebMidi.outputs.find(out => out.id === oid);
  const destinations = midi.inputs[iid].forwarder.destinations;
  const index = destinations.indexOf(output);
  if (index === -1) {
    destinations.push(output);
    midi.forwards[iid] = midi.forwards[iid] || {};
    midi.forwards[iid][oid] = true;
  } else {
    destinations.splice(index, 1);
    delete midi.forwards[iid]?.[oid];
  }
}

export function sortNotes(notes, reverse = false) {
  if (!notes) return [];
  return Object.values(notes).sort((a, b) => {
    const diff = a.number > b.number ? -1 : 1;
    return reverse ? -diff : diff;
  });
}