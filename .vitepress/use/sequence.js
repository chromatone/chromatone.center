import { tempo } from "#/use/tempo.js";
import {
  Sequence,
  PanVol,
  gainToDb,
  Draw,
  Sampler,
  context,
  start,
  Recorder,
  Meter,
  UserMedia,
} from "tone";
import { createChannel } from '#/use/audio'
import { rotateArray } from "#/use/calculations";

// List of all sequences
export const tracks = reactive([]);

// Maximum ratio of the meter to scale them accordingly
export const maxRatio = computed(() => {
  let max = 0
  tracks.forEach(track => {
    let ratio = track.meter.over / track.meter.under
    if (ratio > max) {
      max = ratio
    }
  })
  return max
})

export function useSequence(
  initial = {
    over: 4,
    under: 4,
    sound: "A",
    volume: 1,
  },
  order = 0,
  mode = "bar"
) {

  const seq = reactive({
    meter: useStorage(`tempo-loop-${order}-${mode}`, initial),
    current: '0-0',
    steps: [["0-1"], ["1-1"], ["2-1"], ["3-1"]],
    mutes: useStorage(`metro-${mode}-mutes-${order}`, []),
    accents: useStorage(`metro-${mode}-accents-${order}`, [true]),
    volume: useClamp(useStorage(`metro-${mode}-vol-${order}`, initial?.volume || 1), 0, 1),
    pan: useClamp(useStorage(`metro-${mode}-pan-${order}`, order % 2 == 1 ? -0.5 : 0.5), -1, 1),
    mutesCount: computed(() => seq.mutes.reduce((acc, val) => {
      if (!val) { acc++ }
      return acc
    }, 0)),
    activeSteps: computed(() => {
      return seq.steps.filter(step => !seq.mutes[step[0].split('-')[0]]).map(step => Number(step[0].split('-')[0]))
    }),
    currentSeq: computed(() => seq.mutes.reduce((acc, val) => val ? acc + '0' : acc + '1', '')),
    euclidSeq: computed(() => seq.mutesCount > 0 && seq.mutesCount < seq.steps.length ? getEuclideanRhythm(seq.mutesCount, seq.steps.length) : new Array(seq.steps.length).fill('1').join('')),
    isEuclidean: computed(() => seq.euclidSeq == seq.currentSeq),
    reset() {
      let arr = []
      seq.euclidSeq.split('').forEach((e, i) => {
        arr[i] = (e != false && e != null) ? false : true
      })
      seq.mutes = arr
    },
    rotateAccents(num) {
      seq.accents = rotateArray(seq.accents, num);
      seq.mutes = rotateArray(seq.mutes, num);
    }
  })

  tracks[order] = seq;

  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time);
    },
    seq.steps,
    seq.meter.under + "n"
  ).start(0);

  seq.progress = computed(() => {
    if (tempo.ticks) {
      return sequence.progress;
    } else {
      return 0;
    }
  });

  watch(
    () => seq?.meter?.under,
    () => {
      sequence.stop().dispose();
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time);
        },
        seq.steps,
        seq.meter.under + "n"
      ).start(0);
    }
  );

  watch(
    () => seq?.meter?.over,
    () => {
      seq.steps.length = 0;
      for (let i = 0; i < seq.meter?.over; i++) {
        seq.steps.push([`${i}-1`]);
      }
      sequence.events = seq.steps;
    },
    { immediate: true }
  );

  watchEffect(() => {
    sequence.events = seq.steps;
    seq.accents.length = seq.steps.length;
    const muteL = seq.mutes.length
    seq.mutes.length = seq.steps.length;
    if (muteL < seq.steps.length) {
      seq.mutes.fill(true, muteL)
    }

  });

  watchEffect(() => {
    if (tempo.stopped) {
      seq.current = '1000-1'
    }
  });


  const sounds = {
    A: 'tongue',
    B: 'synth',
    C: 'seiko',
    D: 'ping',
    E: 'logic'
  }

  const urls = {}
  for (let l in sounds) {
    for (let i of [1, 2]) {
      urls[`${l}${i}`] = `${sounds[l]}/${i == 1 ? 'high' : 'low'}.wav`
    }
  }

  const audio = shallowReactive({
    channel: createChannel(`sequence-${mode}-${order}`),
    panner: new PanVol(order % 2 == 1 ? -0.5 : 0.5, 0),
    synth: new Sampler({
      urls,
      volume: 1,
      envelope: {
        attack: 0.001,
        release: 2,
      },
      baseUrl: "/audio/metronome/",
    }),
    mic: new UserMedia(1),
    meter: new Meter(),
    recorder: new Recorder(),
  });

  audio.synth.connect(audio.panner);
  audio.panner.connect(audio.channel);

  audio.mic.connect(audio.meter);
  audio.meter.connect(audio.recorder);

  const recorder = reactive({
    started: false,
    recording: false,
    main: false,
    accent: false,
    both: computed(() => recorder.main && recorder.accent),
    async load(pos = "main", blob) {
      let arr = await blob.arrayBuffer();
      let buff = await audio.recorder.context.decodeAudioData(arr);
      audio.synth.add(pos == "main" ? "F1" : "F2", buff);
      recorder[pos] = true;
      recorder.recording = false;
    },
    async rec(pos = "main") {

      if (!recorder.recording) {
        if (!recorder.started) {
          audio.mic
            .open()
            .then(() => {
              recorder.started = true
              recorder.recording = pos;
              audio.recorder.start();
            })
            .catch((e) => {
              console.log("mic not open");
            });
        } else {
          recorder.recording = pos;
          audio.recorder.start();
        }

      } else {
        let blob = await audio.recorder.stop();
        let arr = await blob.arrayBuffer();
        let buff = await audio.recorder.context.decodeAudioData(arr);
        audio.synth.add(pos == "main" ? "F1" : "F2", buff);
        recorder[pos] = true;
        recorder.recording = false;
      }
    },
  });

  watch(
    () => seq.meter.sound,
    (sound) => {
      if (sound != "F") {
        recorder.main = false;
        recorder.accent = false;
      }
    }
  );

  watch(
    () => seq.volume,
    (vol) => {
      audio.panner.volume.targetRampTo(gainToDb(vol), 1);
    },
    { immediate: true }
  );

  watch(
    () => seq.pan,
    (p) => {
      audio.panner.pan.targetRampTo(p, 1);
    },
    { immediate: true }
  );


  function beatClick(step, time) {
    if (context.state == "suspended") {
      start();
    }
    let mainStep = typeof step == "string" ? + step.split("-")[0] : step;

    Draw.schedule(() => {
      seq.current = step
    }, time);

    let accented = seq.accents[mainStep] && step.split("-")[1] == "1";
    if (seq.mutes[mainStep]) return;
    if (seq.mutes[step]) return;
    if (seq.meter?.sound == "F" && !accented && !recorder.main) return;
    if (seq.meter?.sound == "F" && accented && !recorder.accent) return;
    let note = `${seq.meter?.sound}${accented ? 2 : 1}`;
    audio.synth.triggerAttackRelease(note, seq.meter?.under + "n", time);
    // midiOnce(notes[order * 2] + 3, { time: '+' + time })
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose();
    audio.panner.dispose();
    audio.synth.dispose();
    audio.recorder.dispose();
    audio.channel.dispose()
  });

  return {
    recorder,
    seq,
  };
}

function _getEuclideanRhythm(m, k, input) {
  input = input || new Array(m).fill('1').concat(new Array(k).fill('0'));
  const output = [];

  for (let i = 0; i < Math.min(m, k); i++) {
    output.push(input.shift() + input.pop());
  }

  if (input.length > 1) {
    return _getEuclideanRhythm(output.length, input.length, output.concat(input));
  }

  return output.concat(input);
}

export function getEuclideanRhythm(x, total) {
  return _getEuclideanRhythm(x, total - x).join('');
}