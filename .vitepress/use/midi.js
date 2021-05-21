import { reactive, watchEffect, onMounted } from 'vue'
import { WebMidi } from 'webmidi'
import { useStorage } from '@vueuse/core'

export const midi = reactive({
  enabled: false,
  inputs: {},
  outputs: {},
  playing: false,
  channels: {},
  channel: useStorage('global-midi-channel', 1),
  note: {
    pitch: 3,
    octA: 3,
  },
})

export function useMidi() {
  onMounted(() => {
    WebMidi.enable()
    WebMidi.addListener('enabled', (e) => {
      midi.enabled = true
    })

    WebMidi.addListener('connected', (e) => {
      midi.enabled = true
      midi[e.port.type + 's'][e.port.id] = {
        name: e.port.name,
        manufacturer: e.port.manufacturer,
        channel: 1,
      }
      if (e.port.type == 'input') {
        e.port.addListener('start', () => {
          midi.playing = true
        })
        e.port.addListener('stop', () => {
          midi.playing = false
        })
        e.port.addListener('noteon', (ev) => noteInOn(ev), { channels: 'all' })
        e.port.addListener('noteoff', (ev) => noteInOn(ev), { channels: 'all' })
        e.port.addListener('controlchange', (ev) => ccIn(ev), {
          channels: 'all',
        })
      }
    })

    WebMidi.addListener('disconnected', (e) => {
      delete midi[e.port.type][e.port.id]
    })
  })

  watchEffect(() => {
    let out = Object.values(WebMidi.outputs)
    if (midi.playing) {
      out.forEach((output) => {
        output.sendContinue()
      })
    } else {
      out.forEach((output) => {
        output.sendStop()
      })
    }
  })

  return {
    midi,
    playNote,
    stopNote,
    setCC,
    WebMidi,
  }
}

function noteInOn(ev) {
  let note = processNote(ev)
  midi.note = note
  createChannel(note.channel)
  midi.channels[note.channel].notes[note.name] = note
}

function ccIn(ev) {
  let cc = {
    channel: ev.target.number,
    timestamp: ev.timestamp,
    number: ev.controller.number,
    value: ev.value,
    raw: ev.rawValue,
  }
  createChannel(cc.channel)
  midi.channels[cc.channel].cc[cc.number] = cc
}

function processNote(ev) {
  let note = ev.note
  note.timestamp = ev.timestamp
  note.channel = ev.target.number
  if (ev.type == 'noteoff') {
    note.velocity = 0
  } else {
    note.velocity = ev.velocity
  }
  note.pitch = (note.number + 3) % 12
  note.octA = Math.floor((note.number + 3) / 12) - 1
  return note
}

function createChannel(ch) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = { num: ch, notes: {}, cc: {} }
  }
}

function setVelocity(channel, note, velocity) {
  if (midi.channels?.[channel]?.notes?.[note]) {
    midi.channels[channel].notes[note].velocity = velocity
  }
}

export function playNote(note) {
  setVelocity(note.channel, note.name, 100)
  WebMidi.outputs.forEach((output) => {
    output.playNote(note.name, { channels: note.channel || midi.channel })
  })
}

export function stopNote(note) {
  setVelocity(note.channel, note.name, 0)
  WebMidi.outputs.forEach((output) => {
    output.stopNote(note.name, { channels: note.channel || midi.channel })
  })
}

export function playOnce(note) {
  playNote(note)
  setTimeout(() => {
    stopNote(note)
    console.log('st')
  }, 300)
}

export function setCC(cc, value) {
  WebMidi.outputs.forEach((output) => {
    output.sendControlChange(Number(cc.number), value, cc.channel)
  })
}

export function stopAll() {
  midi.channels = {}
  midi.playing = false
  WebMidi.outputs.forEach((output) => {
    output.turnNotesOff()
    output.turnSoundOff({ time: '+1' })
    output.sendReset()
  })
}
