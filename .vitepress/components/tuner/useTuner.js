import { reactive, ref } from 'vue'
import { useRafFn } from '@vueuse/core'
import Aubio from './aubio.js'

const noteStrings = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
]

const state = reactive({
  middleA: 440,
  semitone: 69,
  span: 64,
  bufferSize: 4096,
  frequencyData: null,
  running: false,
})

const chain = {}

export function useTuner() {
  initGetUserMedia()
  return {
    init,
    state,
    chain,
  }
}

function init() {
  chain.audioContext = new window.AudioContext()
  chain.analyser = chain.audioContext.createAnalyser()
  chain.scriptProcessor = chain.audioContext.createScriptProcessor(
    state.bufferSize,
    1,
    1,
  )

  state.frequencyData = new Uint8Array(chain.analyser.frequencyBinCount)

  const { pause, resume } = useRafFn(() => {
    if (chain?.analyser) {
      chain.analyser.getByteFrequencyData(state.frequencyData)
    }
  })

  Aubio().then(function (aubio) {
    chain.pitchDetector = new aubio.Pitch(
      'default',
      state.bufferSize,
      1,
      chain.audioContext.sampleRate,
    )
    state.running = true
    startRecord()
  })
}

function startRecord() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      chain.audioContext.createMediaStreamSource(stream).connect(chain.analyser)
      chain.analyser.connect(chain.scriptProcessor)
      chain.scriptProcessor.connect(chain.audioContext.destination)
      chain.scriptProcessor.addEventListener('audioprocess', function (event) {
        const frequency = chain.pitchDetector.do(
          event.inputBuffer.getChannelData(0),
        )
        if (frequency) {
          const note = getNote(frequency)
          state.note = {
            name: noteStrings[note % 12],
            value: note,
            cents: getCents(frequency, note),
            octave: parseInt(note / 12) - 1,
            frequency: frequency,
          }
        }
      })
    })
    .catch(function (error) {
      console.log(error.name + ': ' + error.message)
    })
}

function getNote(frequency) {
  const note = 12 * (Math.log(frequency / state.middleA) / Math.log(2))
  return Math.round(note) + state.semitone
}

function getStandardFrequency(note) {
  return state.middleA * Math.pow(2, (note - state.semitone) / 12)
}

function getCents(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2),
  )
}

function play(frequency) {
  if (!tools.oscillator) {
    tools.oscillator = tools.audioContext.createOscillator()
    tools.oscillator.connect(tools.audioContext.destination)
    tools.oscillator.start()
  }
  tools.oscillator.frequency.value = frequency
}

function stop() {
  tools.oscillator.stop()
  tools.oscillator = null
}

function initGetUserMedia() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  if (!window.AudioContext) {
    return alert('AudioContext not supported')
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert('getUserMedia is not implemented in this browser')
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
}
