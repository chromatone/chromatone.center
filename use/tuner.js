/**
 * @module Tuner
 * @description Audio analysis module using Aubio.js and Meyda for pitch detection and audio feature extraction
 */

import { noteColor } from './colors'
import { initGetUserMedia, useAudio } from './audio'
import { reactive, computed, watch, onMounted } from 'vue'
import { rotateArray } from "./calculations";
import { notes } from './theory.js'


const BUFFER_SIZE = 4096;
const TEMPO_BUFFER_SIZE = 512;
const MIDDLE_A = 440;
const SEMITONE = 69;

const noteStrings = rotateArray(notes, 3);

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
  aChroma: computed(() => rotateArray(tuner.chroma, -3)),
  chromaAvg: computed(() => tuner.chroma.reduce((a, b) => a + b, 0) / 12)
});


const chain = {};

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

function handleBeatDetection() {
  if (!tuner.listenBeat || tuner.beat <= tuner.prevBeat) return;

  tuner.prevBeat = tuner.beat;
  tuner.blink = true;
  setTimeout(() => {
    tuner.blink = false;
  }, 60);
}

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

function setupAudioChain(audioContext) {
  chain.audioContext = audioContext;
  chain.analyser = chain.audioContext.createAnalyser();
  chain.scriptProcessor = chain.audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
  chain.beatProcessor = chain.audioContext.createScriptProcessor(TEMPO_BUFFER_SIZE, 1, 1);
}


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


function updateTunerFeatures(features) {
  Object.assign(tuner, {
    rms: features.rms,
    chroma: features.chroma,
    spec: features.amplitudeSpectrum
  });
}


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


function handleBeatProcess(e) {
  if (!chain.tempoAnalyzer) return;
  const tempo = chain.tempoAnalyzer.do(e.inputBuffer.getChannelData(0));
  if (tempo) {
    tuner.beat++;
    tuner.confidence = chain.tempoAnalyzer.getConfidence();
    tuner.bpm = chain.tempoAnalyzer.getBpm();
  }
}

function handleAudioProcess(event) {
  if (!chain.pitchDetector) return;
  const frequency = chain.pitchDetector.do(event.inputBuffer.getChannelData(0));
  tuner.frame++;
  updateTunerNote(frequency);
}

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

function getNote(frequency) {
  return Math.round(12 * (Math.log(frequency / tuner.middleA) / Math.log(2))) + tuner.semitone;
}

function getStandardFrequency(note) {
  return tuner.middleA * Math.pow(2, (note - tuner.semitone) / 12);
}

function getCents(frequency, note) {
  return Math.floor((1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2));
}

function freqColor(frequency) {
  const note = getRawNote(frequency);
  if (typeof note !== 'number') return "#333";
  const octave = Math.floor(note / 12) + 2;
  return noteColor(note, octave);
}

function getRawNote(frequency) {
  return (12 * (Math.log(frequency / MIDDLE_A) / Math.log(2))) % 12;
}