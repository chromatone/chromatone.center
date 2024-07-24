// useString.js
import { ref, watchEffect, watch, onMounted, onBeforeUnmount, reactive } from 'vue';
import { el } from '@elemaudio/core';
import { useMidi } from '#/use';
import { useElementary, layers } from './useElementary';
import { useStorage } from "@vueuse/core";

const defaultParams = {
  "string:volume": { value: 0.8, min: 0, max: 1, step: 0.01 },
  "string:smooth": { value: 0.8, min: 0.0001, max: 0.1, step: 0.001, fixed: 3 },
  "string:feedback": { value: 0.995, min: 0.9, max: 0.9999, step: 0.001, fixed: 3 },
};

export const stringEnabled = ref(false);

export function useString() {
  const { audio, render } = useElementary();
  const { midi } = useMidi();
  const isRendered = ref(false);

  const controls = reactive({});
  const refs = reactive({});

  // Initialize controls
  Object.entries(defaultParams).forEach(([key, param]) => {
    controls[key] = useStorage(`string:${key}`, param.value);
  });

  // MIDI data
  const midiData = reactive({
    trigger: 0,
    note: 42,
    velocity: 0
  });

  let volumeRef, smoothRef, feedbackRef, triggerRef, noteRef, velocityRef;

  watch(() => midi.note, n => {
    if (stringEnabled.value && isRendered.value) {
      midiData.trigger = n.velocity > 0 ? 1 : 0;
      midiData.note = n.number;
      midiData.velocity = n.velocity / 127;
      triggerRef.current = { value: midiData.trigger };
      noteRef.current = { value: midiData.note };
      velocityRef.current = { value: midiData.velocity };
    }
  });

  watchEffect(() => {
    if (audio.initiated) {
      [volumeRef, refs['string:volume']] = audio.core.createRef("const", { value: controls['string:volume'] }, []);
      [smoothRef, refs['string:smooth']] = audio.core.createRef("const", { value: controls['string:smooth'] }, []);
      [feedbackRef, refs['string:feedback']] = audio.core.createRef("const", { value: controls['string:feedback'] }, []);
      [triggerRef, refs['trigger']] = audio.core.createRef("const", { value: midiData.trigger }, []);
      [noteRef, refs['note']] = audio.core.createRef("const", { value: midiData.note }, []);
      [velocityRef, refs['velocity']] = audio.core.createRef("const", { value: midiData.velocity }, []);

      layers.string = {
        volume: 1,
        signal: createStringSignal()
      };
      render('string');
      isRendered.value = true;
    }
  });

  function createStringSignal() {
    const freq = el.mul(440, el.pow(2, el.div(el.sub(noteRef, 69), 12)));
    const delTime = el.mul(el.div(1, freq), 1000);

    const adsr = el.adsr(0.0001, 0.2, 0.01, 0.2, triggerRef);
    const synth = el.mul(adsr, el.noise(), velocityRef);
    const filtered = el.lowpass(880, 6, synth);
    const adsrOsc = el.adsr(0.005, 0.2, 0, 0.1, 1);

    const osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), 0.2);

    const dl = el.delay(
      { size: 44100 },
      el.smooth(
        el.tau2pole(smoothRef),
        el.ms2samps(delTime)),
      feedbackRef,
      filtered
    );

    const both = el.add(dl, osc);
    const signal = el.tanh(both);

    return el.mul(volumeRef, signal);
  }

  // Watch for changes in controls and update refs
  watch(controls, (newValues, oldValues) => {
    if (isRendered.value) {
      Object.keys(newValues).forEach(key => {
        if (newValues[key] !== oldValues[key] && refs[key]) {
          refs[key]({ value: newValues[key] });
        }
      });
    }
  }, { deep: true });

  onMounted(() => {
    stringEnabled.value = true;
  });

  onBeforeUnmount(() => {
    stringEnabled.value = false;
    isRendered.value = false;
  });

  return { controls, defaultParams, audio, render, stringEnabled, isRendered, midiData };
}