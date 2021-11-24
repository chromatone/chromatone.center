import { tempo } from "@use/tempo.js";
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

export const tracks = reactive([]);

export function useSequence(
  metre = {
    over: 4,
    under: 4,
    sound: "A",
    volume: 1,
  },
  order = 0,
  mode = "bar"
) {
  let pan = order % 2 == 1 ? -0.5 : 0.5;

  const audio = {
    meter: null,
    mic: null,
    recorder: null,
    panner: null,
    synth: null,
  };

  audio.panner = new PanVol(pan, 0).toDestination();
  audio.synth = new Sampler({
    urls: {
      A1: "tongue/high.wav",
      A2: "tongue/low.wav",
      B1: "synth/high.wav",
      B2: "synth/low.wav",
      C1: "seiko/high.wav",
      C2: "seiko/low.wav",
      D1: "/ping/high.wav",
      D2: "/ping/low.wav",
      E1: "/logic/high.wav",
      E2: "/logic/low.wav",
    },
    volume: 1,
    envelope: {
      attack: 0.001,
      release: 2,
    },
    baseUrl: "/audio/metronome/",
  }).connect(audio.panner);

  audio.recorder = new Recorder();

  const recorder = reactive({
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
        audio.meter = new Meter().connect(audio.recorder);
        audio.mic = new UserMedia(1).connect(audio.meter);
        audio.mic
          .open()
          .then(() => {
            recorder.recording = pos;
            audio.recorder.start();
          })
          .catch((e) => {
            console.log("mic not open");
          });
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
    () => metre.sound,
    (sound) => {
      if (sound != "F") {
        recorder.main = false;
        recorder.accent = false;
      }
    }
  );

  const current = ref("0-0");
  const steps = reactive([["0-1"], ["1-1"], ["2-1"], ["3-1"]]);
  const mutes = useStorage(
    `metro-${mode}-${metre.over / metre.under}-mutes-${order}`,
    []
  );
  const accents = useStorage(
    `metro-${mode}-${metre.over / metre.under}-accents-${order}`,
    [true]
  );
  const volume = useStorage(`metro-${mode}-vol-${order}`, metre.volume || 1);
  const panning = useStorage(`metro-${mode}-pan-${order}`, pan);

  let sequence = new Sequence(
    (time, step) => {
      beatClick(step, time);
    },
    steps,
    metre.under + "n"
  ).start(0);

  tracks[order] = reactive({
    metre: computed(() => metre),
    steps,
    mutes,
    accents,
  });

  watch(
    () => metre.under,
    () => {
      sequence.stop().dispose();
      sequence = new Sequence(
        (time, step) => {
          beatClick(step, time);
        },
        steps,
        metre.under + "n"
      ).start(0);
    }
  );

  watch(
    () => metre.over,
    () => {
      steps.length = 0;
      for (let i = 0; i < metre.over; i++) {
        steps.push([`${i}-1`]);
      }
      sequence.events = steps;
    },
    { immediate: true }
  );

  watchEffect(() => {
    sequence.events = steps;
    accents.value.length = steps.length;
    mutes.value.length = steps.length;
  });

  watchEffect(() => {
    if (tempo.stopped) {
      current.value = "1000-1";
    }
  });

  watch(
    volume,
    (vol) => {
      audio.panner.volume.targetRampTo(gainToDb(vol), 1);
    },
    { immediate: true }
  );

  watch(
    panning,
    (p) => {
      audio.panner.pan.targetRampTo(p, 1);
    },
    { immediate: true }
  );

  const progress = computed(() => {
    if (tempo.ticks) {
      return sequence.progress;
    } else {
      return 0;
    }
  });

  function beatClick(step, time) {
    if (context.state == "suspended") {
      start();
    }
    let mainStep = typeof step == "string" ? +step.split("-")[0] : step;
    Draw.schedule(() => {
      current.value = step;
    }, time);
    let accented = accents.value[mainStep] && step.split("-")[1] == "1";
    if (mutes.value[mainStep]) return;
    if (mutes.value[step]) return;
    if (metre.sound == "F" && !accented && !recorder.main) return;
    if (metre.sound == "F" && accented && !recorder.accent) return;
    let note = `${metre.sound}${accented ? 2 : 1}`;
    audio.synth.triggerAttackRelease(note, metre.under + "n", time);
    // midiOnce(notes[order * 2] + 3, { time: '+' + time })
  }

  onBeforeUnmount(() => {
    sequence.stop().dispose();
    audio.panner.dispose();
    audio.synth.dispose();
  });

  return {
    progress,
    current,
    steps,
    mutes,
    accents,
    volume,
    panning,
    recorder,
  };
}
