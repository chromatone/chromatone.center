import { reactive, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { tempo } from "./tempo";
import { rotateArray } from "./calculations";
import { globalScale } from "./chroma";
import {
  Sequence,
  PanVol,
  gainToDb,
  Draw,
  PolySynth,
  context,
  start,
  Midi,
  Frequency,
  Time,
} from "tone";
import { midiPlay } from "./midi";
import { createAndDownloadBlobFile } from "./midiRender";
import { createChannel } from './audio'
import { useStorage } from '@vueuse/core'

const loops = reactive([]);

export function useLoop(order = 0) {
  const loop = reactive({
    pitch: computed(() => globalScale.tonic),
    chroma: computed(() => globalScale.set.chroma),
    metre: {
      over: useStorage(`grid-${order}-over`, 4),
      under: useStorage(`grid-${order}-under`, 4),
    },
    octave: useStorage(`grid-${order}-octave`, 3),
    volume: useStorage(`grid-${order}-vol`, 1),
    pan: useStorage(`grid-${order}-pan`, order % 2 == 1 ? -0.5 : 0.5),
    probability: useStorage(`grid-${order}-probability`, 1),
    tonic: computed(() => {
      return loop.pitch + 12 * loop.octave - 3;
    }),
    steps: useStorage(`grid-${order}-steps`, []),
    current: [],
    progress: computed(() => {
      if (tempo.ticks) {
        return sequence?.progress;
      } else {
        return 0;
      }
    }),
    clear() {
      loop.steps.forEach((step, s) => {
        loop.steps[s] = [{}];
      });
    },
    rotate(way = 1) {
      loop.steps = rotateArray(loop.steps, way);
    },
  });

  loops[order] = loop;

  const channel = createChannel(`grid-loop-${order}`)
  const panner = new PanVol(loop.pan, 0).connect(channel);
  const synth = new PolySynth().connect(panner);

  synth.maxPolyphony = 100;

  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time);
    },
    loop.steps,
    loop.metre.under + "n"
  ).start(0);

  watch(
    () => loop.metre.under,
    () => {
      sequence.stop().dispose();
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time);
        },
        loop.steps,
        loop.metre.under + "n"
      ).start(0);
      sequence.probability = loop.probability;
    }
  );

  watch(
    () => loop.metre.over,
    () => {
      if (loop.steps.length > loop.metre.over) {
        loop.steps.length = loop.metre.over;
      } else {
        for (let i = loop.steps.length; i < loop.metre.over; i++) {
          loop.steps.push([{}]);
        }
      }
      sequence.events = loop.steps;
    },
    { immediate: true }
  );

  watchEffect(() => {
    sequence.events = loop.steps;
  });

  watchEffect(() => {
    if (tempo.stopped) {
      loop.current = null;
    }
  });

  watchEffect(() => {
    sequence.probability = loop.probability;
    panner.volume.targetRampTo(gainToDb(loop.volume), 1);
    panner.pan.targetRampTo(loop.pan, 1);
  });

  function beatClick(step, time) {
    if (context.state == "suspended") {
      start();
    }

    let notes = Object.entries(step)
      .map((entry) => {
        if (entry[0] == "sub") return;
        return entry[1] ? Midi(Number(entry[0]) + loop.tonic) : null;
      })
      .filter(Number);

    synth.triggerAttackRelease(
      //@ts-expect-error connect midi and tone
      notes,
      { [loop.metre.under + "n"]: 1 / (step.sub || 1) },
      time
    );

    Draw.schedule(() => {
      let dur = Time({
        [loop.metre.under + "n"]: 1 / (step.sub || 1),
      }).toMilliseconds();
      let midiNotes = notes.map((n) => n.toMidi());
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

import { Writer, Track, NoteEvent } from "midi-writer-js";


export function renderMidiFile() {
  let render = [];
  loops.forEach((loop, l) => {
    let division = 512 / loop.metre.under;
    let midiTrack = new Track();
    midiTrack.setTempo(tempo.bpm, 0);
    midiTrack.addInstrumentName("piano");
    midiTrack.addTrackName("Chromatone grid " + l);
    midiTrack.setTimeSignature(4, 4);
    loop.steps.forEach((step, s) => {
      step.forEach((code, c) => {
        let sub = c;
        let beat = s;
        let subdivision = division / step.length;
        let notes = Object.entries(code)
          .map((entry) =>
            entry[1] == true ? Number(entry[0]) + loop.tonic : null
          )
          .filter((n) => Number(n))
          .map((midi) => Frequency(midi, "midi").toNote());
        midiTrack.addEvent(
          new NoteEvent({
            //@ts-expect-error connect midi and tone
            pitch: notes,
            duration: `T${subdivision}`,
            startTick: division * beat + sub * subdivision,
            velocity: loop.volume * 100,
          })
        );
      });
    });
    // --- LOOP HACK ---
    // midiTrack.addEvent(
    //   new NoteEvent({
    //     pitch: 0,
    //     duration: `T1`,
    //     startTick: division * (track.steps.length - 1),
    //     velocity: 1,
    //   })
    // )
    render[l] = midiTrack;
  });

  var write = new Writer(render);

  createAndDownloadBlobFile(write.buildFile(), "Chromatone-grid");
}
