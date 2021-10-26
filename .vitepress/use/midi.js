import { reactive, watchEffect, onMounted } from 'vue'
import { WebMidi } from 'webmidi'
import { useStorage } from '@vueuse/core'

export const midi = reactive({
  enabled: false,
  out: true,
  inputs: {},
  outputs: {},
  playing: false,
  channels: {},
  channel: useStorage('global-midi-channel', 1),
  note: {
    pitch: 3,
    octA: 3,
  },
  filter: useStorage('global-midi-filter', {}),
  available: computed(() => Object.entries(midi.outputs).length > 0),
})

export function useMidi() {
  onMounted(() => {
    if (WebMidi.supported) {
      setupMidi()
    }
  })

  watchEffect(() => {
    if (!midi.out) return
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
    midiAttack,
    midiRelease,
    midiOnce,
    setCC,
    WebMidi,
  }
}

function setupMidi() {
  WebMidi.enable()
  WebMidi.addListener('enabled', (e) => {
    midi.enabled = true
    initMidi()
  })

  let interval = setInterval(() => {
    initMidi()
  }, 3000)

  WebMidi.addListener('connected', (e) => {
    initMidi()
  })

  WebMidi.addListener('disconnected', (e) => {
    delete midi[e.port.type + 's'][e.port.id]
  })
}

function initMidi() {
  midi.inputs = {}
  WebMidi.inputs.forEach((input) => {
    midi.enabled = true
    midi.inputs[input.id] = {
      name: input.name,
      manufacturer: input.manufacturer,
    }
    input.removeListener()
    input.addListener('start', () => {
      midi.playing = true
    })
    input.addListener('stop', () => {
      midi.playing = false
      midi.channels = {}
    })
    input.addListener('noteon', (ev) => noteInOn(ev), {
      channels: 'all',
    })
    input.addListener('noteoff', (ev) => noteInOn(ev), { channels: 'all' })
    input.addListener('controlchange', (ev) => ccIn(ev), {
      channels: 'all',
    })
  })
  midi.outputs = {}
  WebMidi.outputs.forEach((output) => {
    midi.outputs[output.id] = {
      name: output.name,
      manufacturer: output.manufacturer,
    }
  })
}

function noteInOn(ev) {
  let note = processNote(ev)
  if (midi.filter[note.channel]) return
  midi.note = note
  createChannel(note.channel)
  midi.channels[note.channel].notes[note.number] = note
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
  note.type = ev.type
  note.timestamp = ev.timestamp
  note.channel = ev.target.number
  if (ev.type == 'noteoff') {
    note.velocity = 0
  } else {
    note.velocity = 100
  }
  note.pitch = (note.number + 3) % 12
  note.octA = Math.floor((note.number + 3) / 12) - 1
  return note
}

function createChannel(ch) {
  if (!midi.channels[ch]) {
    midi.channels[ch] = { num: ch, activeNotes: {}, notes: {}, cc: {} }
  }
}

function setVelocity(channel, note, velocity) {
  if (midi.channels?.[channel]?.notes?.[note]) {
    midi.channels[channel].notes[note].velocity = velocity
  }
}

export function midiAttack(note, options) {
  if (!midi.out) return
  let channel = note?.channel || midi.channel
  setVelocity(channel, note?.number, 100)
  WebMidi.outputs.forEach((output) => {
    output.playNote(note.number, {
      channels: channel,
      ...options,
    })
  })
}

export function midiPlay(note, options) {
  if (!midi.out) return
  WebMidi.outputs.forEach((output) => {
    output.playNote(note, {
      channels: midi.channel,
      ...options,
    })
  })
}

export function midiStop(note, options) {
  if (!midi.out) return
  if (note) {
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note, { channels: midi.channel, ...options })
    })
  } else {
    WebMidi.outputs.forEach((output) => {
      output.turnNotesOff()
      output.turnSoundOff({ time: '+1' })
    })
  }
}

export function midiRelease(note) {
  if (!midi.out) return
  if (note) {
    let channel = note?.channel || midi.channel
    setVelocity(channel, note?.number, 0)
    WebMidi.outputs.forEach((output) => {
      output.stopNote(note.number, { channels: channel })
    })
  } else {
    WebMidi.outputs.forEach((output) => {
      output.turnNotesOff()
      output.turnSoundOff({ time: '+1' })
    })
  }
}

export function midiOnce(note, options) {
  if (!midi.out || midi.filter[midi.channel]) return
  midiPlay(note, options)
  setTimeout(() => {
    midiStop(note, options)
  }, 300)
}

export function setCC(cc, value) {
  if (!midi.out) return
  WebMidi.outputs.forEach((output) => {
    output.sendControlChange(Number(cc.number), value, cc.channel)
  })
}

export function stopAll() {
  if (!midi.out) return
  midi.channels = {}
  midi.playing = false
  WebMidi.outputs.forEach((output) => {
    output.turnNotesOff()
    output.turnSoundOff({ time: '+1' })
    output.sendReset()
  })
}

export function createAndDownloadBlobFile(body, filename, extension = 'mid') {
  const blob = new Blob([body])
  const fileName = `${filename}.${extension}`
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
