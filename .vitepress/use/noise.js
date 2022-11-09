import {
  NoiseSynth,
  gainToDb,
  dbToGain,
  FFT,
  Gain,
  AutoFilter,
  AutoPanner,
  BitCrusher,
} from "tone";
import { useStorage, useRafFn, onKeyStroke } from "@vueuse/core";
import { useAudio } from '#/use/audio'
import { createChannel } from "./audio";

const types = { brown: "brown", pink: "pink", white: "white" };

const filterTypes = { lowpass: "LP", highpass: "HP", bandpass: "BP" };

const filterLFOTypes = {
  sine: "SIN",
  triangle: "TRI",
  square: "SQR",
  sawtooth: "SAW",
};

const options = useStorage("noise-options", {
  noise: {
    type: "pink",
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.9,
    release: 1,
  },
  volume: 1,
});

const filterOptions = useStorage("filter-options", {
  on: false,
  play: false,
  volume: 0.5,
  baseFrequency: 50,
  depth: 0.1,
  frequency: 1,
  octaves: 2,
  wet: 1,
  type: "sine",
  filter: {
    Q: 1,
    type: "lowpass",
  },
});

const pannerOptions = useStorage("panner-options", {
  on: false,
  play: false,
  wet: 1,
  frequency: 1,
  depth: 1,
  volume: 1,
});

const crusherOptions = useStorage("bit-options", {
  on: false,
  bits: 16,
  wet: 1,
  volume: 1,
});

export function useNoise() {

  const active = ref(false);
  const fftData = ref([]);
  const fftFreq = ref([]);

  const { channel } = createChannel('noise')

  const fft = new FFT({ size: 512, smoothing: 0.2 }).connect(channel);

  for (let j = 0; j < 32; j++) {
    fftFreq.value[j] = fft.getFrequencyOfIndex(j);
  }
  const gain = new Gain(options.value.volume).connect(fft);
  const filterGain = new Gain(filterOptions.value.volume).connect(fft);
  const pannerGain = new Gain(pannerOptions.value.volume).connect(fft);
  const crusherGain = new Gain(crusherOptions.value.volume).connect(fft);
  const panner = new AutoPanner(pannerOptions.value).connect(pannerGain);
  const crusher = new BitCrusher(crusherOptions.value)
    .connect(crusherGain)
    .connect(panner);

  const filter = new AutoFilter(filterOptions.value)
    .connect(filterGain)
    .connect(crusher);
  const synth = new NoiseSynth(options.value).connect(gain).connect(filter);

  const { pause, resume } = useRafFn(() => {
    let arr = fft.getValue();
    for (let j = 0; j < 32; j++) {
      fftData.value[j] = dbToGain(arr[j]) * 10;
    }
  });

  onKeyStroke(
    " ",
    (e) => {
      e.preventDefault();
      active.value = true;
    },
    { eventName: "keydown" }
  );

  onKeyStroke(
    " ",
    (e) => {
      active.value = false;
    },
    { eventName: "keyup" }
  );

  watch(active, (act) => {
    if (act) {
      synth.triggerAttack();
    } else {
      synth.triggerRelease();
    }
  });

  watch(options.value, () => {
    synth.set(options.value);
  });

  watch(
    () => options.value.volume,
    (vol) => {
      gain.gain.rampTo(vol, 1);
    }
  );

  onBeforeUnmount(() => {
    synth.triggerRelease();
  });

  watch(filterOptions.value, (opt) => {
    opt.play ? filter.start() : filter.stop();
    if (opt.on) {
      filterGain.gain.rampTo(filterOptions.value.volume, 0.2);
    } else {
      filterGain.gain.rampTo(0, 0.2);
    }
    filter.set(opt);
  });

  watch(pannerOptions.value, (opt) => {
    opt.play ? panner.start() : panner.stop();
    opt.on
      ? pannerGain.gain.rampTo(pannerOptions.value.volume, 0.2)
      : pannerGain.gain.rampTo(0, 0.2);
    panner.set(opt);
  });

  watch(crusherOptions.value, (opt) => {
    opt.on
      ? crusherGain.gain.rampTo(crusherOptions.value.volume, 0.2)
      : crusherGain.gain.rampTo(0, 0.2);
    crusher.set(opt);
  });

  return {
    options,
    filterOptions,
    pannerOptions,
    crusherOptions,
    active,
    fftData,
    fftFreq,
    types,
    filterTypes,
    filterLFOTypes,
  };
}
