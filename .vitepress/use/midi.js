import { reactive, onBeforeUnmount, watchEffect, onMounted } from 'vue'
import { WebMidi } from 'webmidi'

export function useMidi() {
  const midi = reactive({
    enabled: false,
    inputs: {},
    outputs: {},
    playing: false,
    channels: {},
  })

  WebMidi.enable()

  WebMidi.addListener('enabled', (e) => {
    midi.enabled = true
  })

  WebMidi.addListener('connected', (e) => {
    midi.enabled = true
    midi[e.port.type + 's'][e.port.id] = {
      name: e.port.name,
      manufacturer: e.port.manufacturer,
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
      e.port.addListener('controlchange', (ev) => ccIn(ev), { channels: 'all' })
    }
  })

  function createChannel(ch) {
    if (!midi.channels[ch]) {
      midi.channels[ch] = { num: ch, notes: {}, cc: {} }
    }
  }

  function noteInOn(ev) {
    let note = processNote(ev)
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

  WebMidi.addListener('disconnected', (e) => {
    delete midi[e.port.type][e.port.id]
  })

  onBeforeUnmount(() => {
    WebMidi.disable()
  })

  watchEffect(() => {
    let out = Object.values(WebMidi.outputs)
    if (midi.playing) {
      out.forEach((output) => {
        output.sendStart()
      })
    } else {
      out.forEach((output) => {
        output.sendStop()
      })
    }
  })

  function playNote(note) {
    WebMidi.outputs.forEach((output) => {
      midi.channels[note.channel].notes[note.name].velocity = 100
      output.playNote(note.name, { channels: note.channel })
    })
  }

  function stopNote(note) {
    WebMidi.outputs.forEach((output) => {
      midi.channels[note.channel].notes[note.name].velocity = 0
      output.stopNote(note.name, { channels: note.channel })
    })
  }

  function setCC(cc, value) {
    WebMidi.outputs.forEach((output) => {
      output.sendControlChange(Number(cc.number), value, cc.channel)
    })
  }

  return {
    midi,
    playNote,
    stopNote,
    setCC,
    WebMidi,
  }
}
