/**
 * @module MIDI
 */
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, computed, watchEffect, onMounted, ref, watch, shallowReactive } from 'vue';
import { WebMidi, Note, Utilities } from "webmidi";
import { setupKeyboard } from './keyboard';
import Ola from "ola";
import { Chord, Midi } from 'tonal';

const MIDI_CHANNEL_STORAGE_KEY = "global-midi-channel";
const MIDI_FILTER_STORAGE_KEY = "global-midi-filter";

export { Utilities, Note }

export const midi = reactive({
  enabled: false,
  initiated: false,
  playing: false,
  stopped: false,
  out: true,
  channel: useStorage(MIDI_CHANNEL_STORAGE_KEY, 1),
  note: { pitch: 0, channel: 1, velocity: 0 },
  offset: useClamp(0, -3, 3),
  keyboard: true,
  cc: {},
  ccLearn: {},
  filter: useStorage(MIDI_FILTER_STORAGE_KEY, {}),
  monoAftertouch: {},
  polyAftertouch: {},
  pitchbend: {}
});

const channels = reactive({})

const inputs = shallowReactive({})
const outputs = shallowReactive({})
const message = ref(null)
const clock = ref(0)
const log = shallowReactive([])
const forwards = shallowReactive({})

const available = computed(() => Object.keys(outputs).length > 0)

export const activeNotes = computed(() => {
  return Object.values(channels).reduce((acc, channel) => {
    return { ...acc, ...channel.activeNotes };
  }, {});
})

export const activeChroma = computed(() => {
  const chroma = new Array(12).fill(0);
  Object.keys(activeNotes.value).forEach(num => {
    const n = (Number(num) - 9) % 12;
    chroma[n] = 1;
  });
  return chroma.join('');
})

export const guessChords = computed(() => {
  const list = Object.keys(activeNotes.value).map(n => Midi.midiToNoteName(Number(n), { sharps: true }));
  return list.length > 2 ? Chord.detect(list) : [];
})

export const activeChromaMidi = computed(() => {
  const chroma = new Array(12).fill(0);
  Object.keys(activeNotes.value).forEach(num => {
    const n = (Number(num) - 9) % 12;
    chroma[n] = Number(num);
  });
  return chroma;
})


export function learnCC({ number, channel }) {
  const val = ref(0);
  watch(() => midi.cc, cc => {
    if ((!channel || cc.channel === channel) && number === cc.number) {
      val.value = cc.value;
    }
  });
  return val;
}

export function playKeyOnce(note, attack, duration) {
  playKey(note, attack, duration)
  requestAnimationFrame(() => playKey(note, 0))
}

export function playKey(noteName = 'A4', attack = 0, duration = 1, midiOut = true) {
  requestAnimationFrame(() => {
    const note = new Note(noteName, {
      attack,
      release: attack,
      duration
    })
    noteInOn({
      type: attack == 0 ? "noteoff" : "noteon",
      note,
      port: { id: "Chromatone.center" },
      timestamp: clock.value,
      target: { number: 0 },
      channel: 0,
      message: {}
    })
    if (!midiOut) return
    if (attack > 0) {
      midiPlay(note.number, { attack })
    } else {
      midiStop(note.number, { attack })
    }
  })
}

export function useMidi() {
  if (!midi.initiated) {
    midi.initiated = true;
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
  }
  return {
    log,
    midi,
    clock,
    channels,
    inputs,
    outputs,
    forwards,
    activeNotes,
    available,
    guessChords,
    activeChroma,
    activeChromaMidi,
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    midiPlay,
    midiStop,
    playKey,
    playKeyOnce,
    stopAll,
    getPitchBend,
    sendPitchBend,
    getMonoAftertouch: (channel) => midi.monoAftertouch[channel] || 0,
    getPolyAftertouch: (channel, note) => midi.polyAftertouch[channel]?.[note] || 0,
  };
}

async function checkMidiPermission() {
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'midi', sysex: true })
      result.addEventListener('change', ev => console.log(ev))
      if (result.state === 'granted') {
        return true
      } else if (result.state === 'prompt') {
        return null
      } else {
        return false
      }
    } catch (error) {
      console.error('Error checking MIDI permission:', error);
    }
  }
  return null
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
  inputs[input.id] = {
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
  Object.entries({
    start: () => { midi.playing = true; midi.stopped = false; },
    stop: () => { midi.playing = false; midi.stopped = Date.now(); },
    clock: handleClock(input),
    midimessage: handleMidiMessage(input),
    noteon: ev => inputs[input.id].note = noteInOn(ev),
    noteoff: ev => inputs[input.id].note = noteInOn(ev),
    controlchange: handleControlChange(input),
    channelaftertouch: handleMonoAftertouch(input),
    keyaftertouch: handlePolyAftertouch(input),
    pitchbend: handlePitchBend(input),
  }).forEach(([event, handler]) => {
    input.addListener(event, handler);
  });
}

function handleClock(input) {
  const diffs = [];
  const avg = Ola({ value: 15 });
  return ev => {
    const diff = ev.timestamp - inputs[input.id].clock;
    diffs.push(diff);
    if (diffs.length > 50) diffs.shift();
    avg.value = diffs.reduce((acc, d) => acc + d, 0) / diffs.length;
    inputs[input.id].diff = avg.value;
    inputs[input.id].bpm = (1000 / avg.value / 24) * 60;
    inputs[input.id].clock = ev.timestamp;
  };
}

function handleMidiMessage(input) {
  return ev => {
    if (ev?.message?.type === "clock") return;
    inputs[input.id].event = ev;
    message.value = ev.message;

    log.unshift(ev);
    if (log.length > 100) log.pop();
  };
}

function handleControlChange(input) {
  return ev => {
    const cc = ccIn(ev);
    if (!cc) return;
    inputs[input.id].cc = cc;
    midi.cc = cc;
  };
}

function handlePitchBend(input) {
  return ev => {
    midi.pitchbend[ev.port.name] = ev.value;
  };
}

function handleMonoAftertouch(input) {
  return ev => {
    let ch = ev.channel || 0
    createMidiChannel(ch)
    midi.monoAftertouch[ch] = ev.value;
    channels[ch].monoAftertouch = ev.value;
  };
}

function handlePolyAftertouch(input) {
  return ev => {
    let ch = ev.channel || 0
    createMidiChannel(ch)
    if (!midi.polyAftertouch[ch]) midi.polyAftertouch[ch] = {};
    midi.polyAftertouch[ch][ev.note.number] = ev.value;
    channels[ch].polyAftertouch[ev.note.number] = ev.value;
  };
}

function setupOutput(output) {
  outputs[output.id] = {
    name: output.name,
    manufacturer: output.manufacturer,
  };
}

function handleDisconnect(e) {
  if (e.port.type == 'input') {
    delete inputs[e.port.id];
  } else if (e.port.type == 'output') {
    delete outputs[e.port.id];
  }

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
  channels[note.channel].notes[note.number] = note;
  if (ev.type === "noteoff") {
    note.velocity = 0;
    delete channels[note.channel].activeNotes[note.number];
    delete midi.polyAftertouch[note.channel]?.[note.number];
  } else {
    note.velocity = 120 * (ev.note.attack || 1);
    channels[note.channel].activeNotes[note.number] = ev.note.attack;
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
  channels[cc.channel].cc[cc.number] = cc;
  return cc;
}

function createMidiChannel(ch) {
  if (!channels[ch]) {
    channels[ch] = reactive({
      num: ch,
      activeNotes: {},
      notes: {},
      cc: {},
      monoAftertouch: 0,
      polyAftertouch: {},
      pitchbend: 0,
    });
  }
}

export function getPitchBend(channel) {
  return midi.pitchbend[channel] || 0;
}

function setVelocity(channel, note, velocity) {
  channels[channel] = channels[channel] || { notes: {} }
  channels[channel].notes[note] = channels[channel].notes[note] || { velocity: 0 }
  channels[channel].notes[note].velocity = velocity;
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

export function midiOnce(note, options, duration = 300) {
  if (!midi.out || midi.filter[midi.channel]) return;
  midiPlay(note, options);
  setTimeout(() => {
    midiStop(note, options);
  }, duration);
}

export function setCC(cc, value) {
  if (!midi.out) return;
  WebMidi.outputs.forEach(output => {
    output.sendControlChange(Number(cc.number), value, cc.channel);
  });
}

export function sendPitchBend(value, options = {}) {
  if (!midi.out) return;
  const channel = options.channel || midi.channel;
  WebMidi.outputs.forEach(output => {
    output.sendPitchBend(value, { channels: channel, ...options });
  });
}

export function stopAll() {
  if (!midi.out) return;
  Object.assign(channels, {})
  midi.monoAftertouch = {};
  midi.polyAftertouch = {};
  midi.playing = false;
  WebMidi.outputs.forEach(output => {
    output.sendAllNotesOff();
    output.sendAllSoundOff();
    output.sendReset();
    output.sendSongPosition(0);
    output.sendPitchBend(0);
  });
  midi.stopped = true;
}

export function forwardMidi(iid, oid) {
  const output = WebMidi.outputs.find(out => out.id === oid);
  const destinations = inputs[iid].forwarder.destinations;
  const index = destinations.indexOf(output);
  if (index === -1) {
    destinations.push(output);
    forwards[iid] = forwards[iid] || {};
    forwards[iid][oid] = true;
  } else {
    destinations.splice(index, 1);
    delete forwards[iid]?.[oid];
  }
}

export function sortNotes(notes, reverse = false) {
  if (!notes) return [];
  return Object.values(notes).sort((a, b) => {
    const diff = a.number > b.number ? -1 : 1;
    return reverse ? -diff : diff;
  });
}

export function playNoteOnce(note, velocity, duration = 300) {
  playNote(note, velocity)
  setTimeout(() => stopNote(note), duration)
}


export function playNote(note, velocity = 0.9) {
  if (Array.isArray(note)) {
    note.forEach(n => playNote(n))
  } else {
    playKey(note, velocity)
  }
}

export function stopNote(note) {
  if (!note) {
    stopAll()
    return
  }
  if (Array.isArray(note)) {
    note.forEach(n => stopNote(n))
  } else {
    playKey(note, 0)
  }
}