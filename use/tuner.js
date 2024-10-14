/**
 * @module Tuner
 * @description Audio analysis module using Aubio.js and Meyda for pitch detection and audio feature extraction
 */

import { noteColor } from './colors'
import { initGetUserMedia, useAudio } from './audio'
import { reactive, computed, watch, onMounted } from 'vue'
import { rotateArray } from "./calculations";
import { notes } from './theory.js'

/** @constant {number} */
const BUFFER_SIZE = 4096;
/** @constant {number} */
const TEMPO_BUFFER_SIZE = 512;
/** @constant {number} */
const MIDDLE_A = 440;
/** @constant {number} */
const SEMITONE = 69;

const noteStrings = rotateArray(notes, 3);

/**
 * @typedef {Object} TunerNote
 * @property {string} name - The name of the note
 * @property {number} value - The MIDI note value
 * @property {number} cents - The cents deviation from the perfect pitch
 * @property {number} octave - The octave of the note
 * @property {number} frequency - The frequency of the note
 * @property {string} color - The color associated with the note
 * @property {boolean} silent - Whether the note is silent
 */

/**
 * @typedef {Object} TunerState
 * @property {boolean} initiated - Whether the tuner has been initiated
 * @property {boolean} initiating - Whether the tuner is currently initiating
 * @property {MediaStream|null} stream - The audio input stream
 * @property {number} middleA - The frequency of middle A
 * @property {number} semitone - The MIDI note number of middle A
 * @property {TunerNote} note - The current detected note
 * @property {number} span - The span of the tuner
 * @property {number} bufferSize - The size of the audio buffer
 * @property {number} tempoBufferSize - The size of the tempo buffer
 * @property {boolean} running - Whether the tuner is running
 * @property {number} frame - The current frame number
 * @property {number} beat - The current beat number
 * @property {number} bpm - The detected beats per minute
 * @property {number} confidence - The confidence of the tempo detection
 * @property {boolean} listenBeat - Whether to listen for beats
 * @property {number} prevBeat - The previous beat number
 * @property {boolean} blink - Whether to blink (for visual feedback)
 * @property {number[]} chroma - The chroma vector
 * @property {number[]} spec - The amplitude spectrum
 * @property {number} rms - The root mean square of the signal
 */

/** @type {TunerState} */
export const tuner = reactive({
  initiated: false,
  initiating: false,
  stream: null,
  middleA: MIDDLE_A,
  semitone: SEMITONE,
  note: {
    name: "A",
    value: 69,
    cents: 0,
    octave: 4,
    frequency: 440,
    color: freqColor(440),
    silent: false,
  },
  span: 64,
  bufferSize: BUFFER_SIZE,
  tempoBufferSize: TEMPO_BUFFER_SIZE,
  running: false,
  frame: 0,
  beat: 0,
  bpm: 0,
  confidence: 0,
  listenBeat: false,
  prevBeat: 0,
  blink: false,
  chroma: new Array(12).fill(0),
  spec: [],
  rms: 0,
});

/**
 * Computed property for rotated chroma vector
 */
tuner.aChroma = computed(() => rotateArray(tuner.chroma, -3));

/**
 * Computed property for average chroma value
 */
tuner.chromaAvg = computed(() => tuner.chroma.reduce((a, b) => a + b, 0) / 12);

/** @type {Object} */
const chain = {};

/**
 * Tuner composable function
 * @returns {Object} An object containing init function, tuner state, and audio chain
 */
export function useTuner() {
  initGetUserMedia();

  onMounted(() => {
    watch(() => tuner.frame, handleBeatDetection);
  });

  return {
    init,
    tuner,
    chain,
  };
}

/**
 * Handles beat detection
 */
function handleBeatDetection() {
  if (!tuner.listenBeat || tuner.beat <= tuner.prevBeat) return;

  tuner.prevBeat = tuner.beat;
  tuner.blink = true;
  setTimeout(() => {
    tuner.blink = false;
  }, 60);
}

/**
 * Initializes the tuner
 * @returns {Promise<void>}
 */
async function init() {
  if (tuner.initiated) return;
  tuner.initiating = true;

  const { master } = useAudio();
  setupAudioChain(master.context);

  await setupMeydaAnalyzer();
  await setupAubio();

  tuner.running = true;
  start();
  tuner.initiated = true;
  tuner.initiating = false;
}

/**
 * Sets up the audio processing chain
 * @param {AudioContext} audioContext - The audio context
 */
function setupAudioChain(audioContext) {
  chain.audioContext = audioContext;
  chain.analyser = chain.audioContext.createAnalyser();
  chain.scriptProcessor = chain.audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
  chain.beatProcessor = chain.audioContext.createScriptProcessor(TEMPO_BUFFER_SIZE, 1, 1);
}

/**
 * Sets up the Meyda analyzer
 * @returns {Promise<void>}
 */
async function setupMeydaAnalyzer() {
  const Meyda = await import('meyda');
  chain.meyda = Meyda.createMeydaAnalyzer({
    audioContext: chain.audioContext,
    source: chain.analyser,
    bufferSize: BUFFER_SIZE,
    featureExtractors: ["chroma", "amplitudeSpectrum", "rms"],
    callback: updateTunerFeatures,
  });
  chain.meyda.start();
}

/**
 * Updates tuner features based on Meyda analysis
 * @param {Object} features - The extracted features
 */
function updateTunerFeatures(features) {
  Object.assign(tuner, {
    rms: features.rms,
    chroma: features.chroma,
    spec: features.amplitudeSpectrum
  });
}

/**
 * Sets up Aubio for pitch and tempo detection
 * @returns {Promise<void>}
 */
async function setupAubio() {
  const { default: Aubio } = await import('aubiojs/build/aubio.esm.js');
  const aubio = await Aubio();

  chain.pitchDetector = new aubio.Pitch(
    "default",
    BUFFER_SIZE * 4,
    BUFFER_SIZE,
    chain.audioContext.sampleRate
  );
  chain.tempoAnalyzer = new aubio.Tempo(
    TEMPO_BUFFER_SIZE * 4,
    TEMPO_BUFFER_SIZE,
    chain.audioContext.sampleRate
  );
}

/**
 * Starts the audio input stream
 */
function start() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    console.warn('MediaDevices API not available');
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(setupAudioStream)
    .catch(error => console.log(`${error.name}: ${error.message}`));
}

/**
 * Sets up the audio stream and connects it to the audio chain
 * @param {MediaStream} stream - The audio input stream
 */
function setupAudioStream(stream) {
  tuner.stream = stream;
  const mediaStream = chain.audioContext
    .createMediaStreamSource(stream)
    .connect(chain.analyser);
  chain.analyser.connect(chain.scriptProcessor);
  chain.analyser.connect(chain.beatProcessor);
  chain.scriptProcessor.connect(chain.audioContext.destination);
  chain.beatProcessor.connect(chain.audioContext.destination);
  chain.beatProcessor.addEventListener("audioprocess", handleBeatProcess);
  chain.scriptProcessor.addEventListener("audioprocess", handleAudioProcess);
}

/**
 * Handles beat processing
 * @param {AudioProcessingEvent} e - The audio processing event
 */
function handleBeatProcess(e) {
  if (!chain.tempoAnalyzer) return;
  const tempo = chain.tempoAnalyzer.do(e.inputBuffer.getChannelData(0));
  if (tempo) {
    tuner.beat++;
    tuner.confidence = chain.tempoAnalyzer.getConfidence();
    tuner.bpm = chain.tempoAnalyzer.getBpm();
  }
}

/**
 * Handles audio processing for pitch detection
 * @param {AudioProcessingEvent} event - The audio processing event
 */
function handleAudioProcess(event) {
  if (!chain.pitchDetector) return;
  const frequency = chain.pitchDetector.do(event.inputBuffer.getChannelData(0));
  tuner.frame++;
  updateTunerNote(frequency);
}

/**
 * Updates the tuner note based on the detected frequency
 * @param {number} frequency - The detected frequency
 */
function updateTunerNote(frequency) {
  if (frequency) {
    const note = getNote(frequency);
    tuner.note = {
      name: noteStrings[note % 12],
      value: note,
      cents: getCents(frequency, note),
      octave: Math.floor(note / 12) - 1,
      frequency: frequency,
      color: freqColor(frequency),
      silent: false,
    };
  } else {
    tuner.note.silent = true;
  }
}

/**
 * Gets the MIDI note number from a frequency
 * @param {number} frequency - The input frequency
 * @returns {number} The MIDI note number
 */
function getNote(frequency) {
  return Math.round(12 * (Math.log(frequency / tuner.middleA) / Math.log(2))) + tuner.semitone;
}

/**
 * Gets the standard frequency for a given note
 * @param {number} note - The MIDI note number
 * @returns {number} The standard frequency
 */
function getStandardFrequency(note) {
  return tuner.middleA * Math.pow(2, (note - tuner.semitone) / 12);
}

/**
 * Calculates the cents deviation from the perfect pitch
 * @param {number} frequency - The input frequency
 * @param {number} note - The MIDI note number
 * @returns {number} The cents deviation
 */
function getCents(frequency, note) {
  return Math.floor((1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2));
}

/**
 * Gets the color associated with a frequency
 * @param {number} frequency - The input frequency
 * @returns {string} The color in hexadecimal format
 */
function freqColor(frequency) {
  const note = getRawNote(frequency);
  if (typeof note !== 'number') return "#333";
  const octave = Math.floor(note / 12) + 2;
  return noteColor(note, octave);
}

/**
 * Gets the raw note value (0-11) from a frequency
 * @param {number} frequency - The input frequency
 * @returns {number} The raw note value
 */
function getRawNote(frequency) {
  return (12 * (Math.log(frequency / MIDDLE_A) / Math.log(2))) % 12;
}