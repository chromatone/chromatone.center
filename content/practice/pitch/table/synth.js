import { gainToDb, PanVol, MonoSynth } from "tone";
import { pitchFreq } from "#/use/calculations";
import { state } from "./state";
import { createAudioChannel } from "#/use/audio";
import { reactive, computed, onBeforeUnmount, watch } from 'vue'



export function useSynth(pitch, octave) {
  const { channel } = createAudioChannel('table')
  const panVol = new PanVol(0, -Infinity).connect(channel);

  const synth = new MonoSynth({
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.5,
    },
    filterEnvelope: {
      attack: 0.05,
    },
  }).connect(panVol);

  const voice = reactive({
    vol: 0,
    pan: 50,
    started: false,
    active: computed(() => {
      return voice.vol > 0;
    }),
    freq: computed(() => {
      let freq = pitchFreq(pitch, octave, state.middleA);
      synth.oscillator.frequency.value = freq;
      return freq;
    }),
  });

  onBeforeUnmount(() => {
    synth.triggerRelease();
    synth.dispose();
  });

  watch(
    () => voice.vol,
    (vol) => {
      panVol.volume.targetRampTo(gainToDb((vol * 0.4) / 100), '16n');
    }
  );

  watch(
    () => voice.pan,
    (pan) => {
      let place = ((pan - 50) / 100) * 2;
      panVol.pan.targetRampTo(place, '16n');
    }
  );

  watch(
    () => state.stopped,
    (stop) => {
      if (stop) {
        voice.vol = 0;
        voice.pan = 50;
      }
    }
  );

  watch(
    () => voice.active,
    (act) => {
      if (act) {
        if (state.stopped) state.stopped = false;
        synth.triggerAttack(voice.freq);
      } else {
        synth.triggerRelease();
      }
    }
  );

  return voice;
}
