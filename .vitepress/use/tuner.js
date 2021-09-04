import Aubio from './aubio.js'
import { initGetUserMedia, pitchColor } from 'chromatone-theory'
import Meyda from 'meyda'

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

const settings = {
  middleA: 440,
  semitone: 69,
}

const state = reactive({
  initiated: false,
  stream: null,
  middleA: settings.middleA,
  semitone: settings.semitone,
  note: {
    name: 'A',
    value: 69,
    cents: 0,
    octave: 4,
    frequency: 440,
    color: freqColor(440),
    silent: false,
  },
  span: 64,
  bufferSize: 4096,
  tempoBufferSize: 512,
  frequencyData: null,
  running: false,
  frame: 0,
  beat: 0,
  bpm: 0,
  confidence: 0,
  chroma: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  spec: [],
  rms: 0,
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
  state.initiated = true
  chain.audioContext = new window.AudioContext()
  chain.analyser = chain.audioContext.createAnalyser()
  chain.scriptProcessor = chain.audioContext.createScriptProcessor(
    state.bufferSize,
    1,
    1,
  )
  chain.beatProcessor = chain.audioContext.createScriptProcessor(
    state.tempoBufferSize,
    1,
    1,
  )

  //MEYDA
  chain.meyda = Meyda.createMeydaAnalyzer({
    audioContext: chain.audioContext,
    source: chain.analyser,
    bufferSize: 4096,
    featureExtractors: ['chroma', 'amplitudeSpectrum', 'rms'],
    callback: (features) => {
      state.rms = features.rms
      state.chroma = features.chroma
      state.spec = features.amplitudeSpectrum
    },
  })
  chain.meyda.start()
  // END of MEYDA

  state.frequencyData = new Uint8Array(chain.analyser.frequencyBinCount)

  Aubio().then(function (aubio) {
    chain.pitchDetector = new aubio.Pitch(
      'default',
      state.bufferSize,
      1,
      chain.audioContext.sampleRate,
    )
    chain.tempoAnalyzer = new aubio.Tempo(
      state.tempoBufferSize * 4,
      state.tempoBufferSize,
      chain.audioContext.sampleRate,
    )
    state.running = true
    start()
  })
}

function start() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      state.stream = stream
      const mediaStream = chain.audioContext
        .createMediaStreamSource(stream)
        .connect(chain.analyser)
      mediaStream.connect(chain.scriptProcessor)
      chain.analyser.connect(chain.scriptProcessor)
      chain.analyser.connect(chain.beatProcessor)
      // chain.scriptProcessor.connect(chain.audioContext.destination)
      // chain.beatProcessor.connect(chain.audioContext.destination)
      chain.beatProcessor.addEventListener('audioprocess', (e) => {
        const tempo = chain.tempoAnalyzer.do(e.inputBuffer.getChannelData(0))
        if (tempo) {
          state.beat++
          state.confidence = chain.tempoAnalyzer.getConfidence()
          state.bpm = chain.tempoAnalyzer.getBpm()
        }
      })
      chain.scriptProcessor.addEventListener('audioprocess', function (event) {
        const frequency = chain.pitchDetector.do(
          event.inputBuffer.getChannelData(0),
        )
        state.frame++
        if (frequency) {
          const note = getNote(frequency)
          state.note = {
            name: noteStrings[note % 12],
            value: note,
            cents: getCents(frequency, note),
            octave: parseInt(note / 12) - 1,
            frequency: frequency,
            color: freqColor(frequency),
            silent: false,
          }
        } else {
          state.note.silent = true
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

function freqColor(frequency) {
  const note = getRawNote(frequency)
  if (!note) return '#333'
  const octave = parseInt(note / 12) + 2
  const color = pitchColor(note, octave)
  return color
}

function getRawNote(frequency) {
  return (12 * (Math.log(frequency / settings.middleA) / Math.log(2))) % 12
}
