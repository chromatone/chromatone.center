/**
 * @module Tuner - pitch detection
 * @description Audio analysis on the fly using Aubio.js and Meyda
 */

import { noteColor } from './colors'
import { initGetUserMedia, useAudio } from './audio'
import { reactive, computed, watch } from 'vue'
import { rotateArray } from "./calculations";
import { notes } from './theory.js'

const noteStrings = rotateArray(notes, 3)

const settings = {
  middleA: 440,
  semitone: 69,
};

export const tuner = reactive({
  initiated: false,
  initiating: false,
  stream: null,
  middleA: settings.middleA,
  semitone: settings.semitone,
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
  bufferSize: 4096,
  tempoBufferSize: 512,
  frequencyData: null,
  running: false,
  frame: 0,
  beat: 0,
  bpm: 0,
  confidence: 0,
  listenBeat: false,
  prevBeat: 0,
  blink: false,
  chroma: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  aChroma: computed(() => rotateArray(tuner.chroma, -3)),
  chromaAvg: computed(() => tuner.chroma.reduce((a, b) => a + b, 0) / 12),
  // activeNotes: computed(() => {
  //   const notes = []
  //   for (let n in tuner.aChroma) {
  //     if (tuner.aChroma[n] > 0.8) {
  //       notes.push(n)
  //     }
  //   }
  //   return notes
  // }),
  spec: [],
  rms: 0,
});

const chain = {};

export function useTuner() {
  initGetUserMedia();
  return {
    init,
    tuner,
    chain,
  };
}

async function init() {
  if (tuner.initiated) return
  tuner.initiating = true
  const { master } = useAudio()
  chain.audioContext = master.context;
  chain.analyser = chain.audioContext.createAnalyser();
  chain.scriptProcessor = chain.audioContext.createScriptProcessor(
    tuner.bufferSize,
    1,
    1
  );
  chain.beatProcessor = chain.audioContext.createScriptProcessor(
    tuner.tempoBufferSize,
    1,
    1
  );

  watch(
    () => tuner.frame,
    () => {
      if (!tuner.listen) return;
      if (tuner.beat > tuner.prevBeat) {
        tuner.prevBeat = tuner.beat;
        tuner.blink = true;
        setTimeout(() => {
          tuner.blink = false;
        }, 60);
      }
    }
  );

  const Meyda = await import('meyda')

  chain.meyda = Meyda.createMeydaAnalyzer({
    audioContext: chain.audioContext,
    source: chain.analyser,
    bufferSize: 4096,
    featureExtractors: ["chroma", "amplitudeSpectrum", "rms"],
    callback: (features) => {
      tuner.rms = features.rms;
      tuner.chroma = features.chroma;
      tuner.spec = features.amplitudeSpectrum;
    },
  });
  chain.meyda.start();

  tuner.frequencyData = new Uint8Array(chain.analyser.frequencyBinCount);

  const { default: Aubio } = await import('./aubio.js')

  Aubio().then(function (aubio) {
    chain.pitchDetector = new aubio.Pitch(
      "default",
      tuner.bufferSize,
      1,
      chain.audioContext.sampleRate
    );
    chain.tempoAnalyzer = new aubio.Tempo(
      tuner.tempoBufferSize * 4,
      tuner.tempoBufferSize,
      chain.audioContext.sampleRate
    );
    tuner.running = true;
    start();
  });
  tuner.initiated = true;
  tuner.initiating = false
}

function start() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      tuner.stream = stream;
      const mediaStream = chain.audioContext
        .createMediaStreamSource(stream)
        .connect(chain.analyser);
      // mediaStream.connect(chain.scriptProcessor)
      chain.analyser.connect(chain.scriptProcessor);
      chain.analyser.connect(chain.beatProcessor);
      chain.scriptProcessor.connect(chain.audioContext.destination);
      chain.beatProcessor.connect(chain.audioContext.destination);
      chain.beatProcessor.addEventListener("audioprocess", (e) => {
        if (!chain.tempoAnalyzer) return
        const tempo = chain.tempoAnalyzer.do(e.inputBuffer.getChannelData(0));
        if (tempo) {
          tuner.beat++;
          tuner.confidence = chain.tempoAnalyzer.getConfidence();
          tuner.bpm = chain.tempoAnalyzer.getBpm();
        }
      });
      chain.scriptProcessor.addEventListener("audioprocess", function (event) {
        if (!chain.pitchDetector) return
        const frequency = chain.pitchDetector.do(
          event.inputBuffer.getChannelData(0)
        );
        tuner.frame++;
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
      });
    })
    .catch(function (error) {
      console.log(error.name + ": " + error.message);
    });
}

function getNote(frequency) {
  const note = 12 * (Math.log(frequency / tuner.middleA) / Math.log(2));
  return Math.round(note) + tuner.semitone;
}

function getStandardFrequency(note) {
  return tuner.middleA * Math.pow(2, (note - tuner.semitone) / 12);
}

function getCents(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / getStandardFrequency(note))) / Math.log(2)
  );
}

function freqColor(frequency) {
  const note = getRawNote(frequency);
  if (!note) return "#333";
  const octave = Math.floor(note / 12) + 2;
  const color = noteColor(note, octave);
  return color;
}

function getRawNote(frequency) {
  return (12 * (Math.log(frequency / settings.middleA) / Math.log(2))) % 12;
}
