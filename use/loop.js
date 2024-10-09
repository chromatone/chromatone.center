/**
 * @module Loop
 */

import { reactive, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { tempo } from "./tempo";
import { rotateArray } from "./calculations";
import { globalScale } from "./global";
import { Sequence, PanVol, gainToDb, getDraw, PolySynth, start, Midi, Frequency, Time, getContext } from "tone";
import { midiPlay } from "./midi";
import { createAndDownloadBlobFile } from "./midiRender";
import { createAudioChannel } from './audio'
import { useStorage } from '@vueuse/core'

const loops = reactive([]);

const createStorageKey = (prefix, order) => `${prefix}-${order}`;

export function useLoop(order = 0) {
  const storageKey = (suffix) => createStorageKey(`grid-${order}`, suffix);

  const loop = reactive({
    pitch: computed(() => globalScale.tonic),
    chroma: computed(() => globalScale.set.chroma),
    metre: {
      over: useStorage(storageKey('over'), 4),
      under: useStorage(storageKey('under'), 4),
    },
    octave: useStorage(storageKey('octave'), 3),
    volume: useStorage(storageKey('vol'), 1),
    pan: useStorage(storageKey('pan'), order % 2 ? -0.5 : 0.5),
    probability: useStorage(storageKey('probability'), 1),
    tonic: computed(() => loop.pitch + 12 * loop.octave - 3),
    steps: useStorage(storageKey('steps'), []),
    current: [],
    progress: computed(() => tempo.ticks ? sequence?.progress : 0),
    clear() {
      loop.steps.forEach((_, s) => {
        loop.steps[s] = [{}];
      });
    },
    rotate(way = 1) {
      loop.steps = rotateArray(loop.steps, way);
    },
  });

  loops[order] = loop;

  const { channel } = createAudioChannel(`grid-loop-${order}`);
  const panner = new PanVol(loop.pan, 0).connect(channel);
  const synth = new PolySynth().connect(panner);

  synth.maxPolyphony = 100;

  let sequence = createSequence();

  watch(() => loop.metre.under, recreateSequence);
  watch(() => loop.metre.over, updateSteps, { immediate: true });
  watchEffect(() => { sequence.events = loop.steps; });
  watchEffect(() => { if (tempo.stopped) loop.current = null; });
  watchEffect(updatePannerSettings);

  function createSequence() {
    return new Sequence(
      (time, step) => beatClick(step, time),
      loop.steps,
      `${loop.metre.under}n`
    ).start(0);
  }

  function recreateSequence() {
    sequence.stop().dispose();
    sequence = createSequence();
    sequence.probability = loop.probability;
  }

  function updateSteps() {
    if (loop.steps.length > loop.metre.over) {
      loop.steps.length = loop.metre.over;
    } else {
      for (let i = loop.steps.length; i < loop.metre.over; i++) {
        loop.steps.push([{}]);
      }
    }
    sequence.events = loop.steps;
  }

  function updatePannerSettings() {
    sequence.probability = loop.probability;
    panner.volume.targetRampTo(gainToDb(loop.volume), 1);
    panner.pan.targetRampTo(loop.pan, 1);
  }

  function beatClick(step, time) {
    if (getContext().state === "suspended") {
      start();
    }

    const notes = Object.entries(step)
      .filter(([key]) => key !== "sub")
      .map(([key, value]) => value ? Midi(Number(key) + loop.tonic) : null)
      .filter(Boolean);

    const duration = { [loop.metre.under + "n"]: 1 / (step.sub || 1) };

    synth.triggerAttackRelease(notes, duration, time);

    const Draw = getDraw();
    Draw.schedule(() => {
      const dur = Time(duration).toMilliseconds();
      const midiNotes = notes.map((n) => n.toMidi());
      midiPlay(midiNotes, { duration: dur, attack: loop.volume });
    }, time);
  }

  onBeforeUnmount(() => {
    loops.splice(order, 1);
    sequence.stop().dispose();
    panner.dispose();
    synth.dispose();
  });

  return loop;
}

export async function renderLoopsMidiFile() {
  const MidiWriter = await import("midi-writer-js");

  const render = loops.map((loop, l) => {
    const division = 512 / loop.metre.under;
    const midiTrack = new MidiWriter.Track();

    midiTrack.setTempo(tempo.bpm, 0);
    midiTrack.addInstrumentName("piano");
    midiTrack.addTrackName(`Chromatone grid ${l}`);
    midiTrack.setTimeSignature(4, 4, 24, 8);

    loop.steps.forEach((step, s) => {
      step.forEach((code, c) => {
        const subdivision = division / step.length;
        const notes = Object.entries(code)
          .filter(([, value]) => value === true)
          .map(([key]) => Number(key) + loop.tonic)
          .map((midi) => Frequency(midi, "midi").toNote());

        midiTrack.addEvent(
          new MidiWriter.NoteEvent({
            pitch: notes,
            duration: `T${subdivision}`,
            startTick: division * s + c * subdivision,
            velocity: loop.volume * 100,
          })
        );
      });
    });

    return midiTrack;
  });

  const write = new MidiWriter.Writer(render);
  createAndDownloadBlobFile(write.buildFile(), "Chromatone-grid");
}