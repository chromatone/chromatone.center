import { reactive, computed, watchEffect, ref } from 'vue';
import { el } from '@elemaudio/core';
import { useTempo } from '#/use';
import { useParams } from './useParams';
import { useElementary, layers } from './useElementary';
import { freqPitch } from '#/use';
import { hatSynth } from './useDrums';

const params = {
  'time:bpm': { value: 120, min: 30, max: 250, step: 1, smooth: 0.1 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
  'time:click': { value: 0, min: 0, max: 1, step: 1, hidden: true },
  'time:volume': { value: 0, min: 0, max: 1, step: 0.001 },
  'time:playing': { value: 0, min: 0, max: 1, step: 1, hidden: true },
};

export const timeEnabled = ref(true);

export function useTime() {
  const { audio, render } = useElementary();
  const { controls, cv, groups } = useParams(params, 'time');

  const tempo = useTempo();

  watchEffect(() => {
    controls['time:bpm'] = tempo.bpm;
  });

  const transport = reactive({
    started: 0,
    paused: 0,
    play() {
      if (this.started === 0) {
        this.started = audio.ctx?.currentTime || 0;
      } else if (this.paused !== 0) {
        this.started += (audio.ctx?.currentTime || 0) - this.paused;
        this.paused = 0;
      }
      controls['time:playing'] = 1;
    },
    pause() {
      if (this.started !== 0 && this.paused === 0) {
        this.paused = audio.ctx?.currentTime || 0;
      }
      controls['time:playing'] = 0;
    },
    stop() {
      this.started = 0;
      this.paused = 0;
      controls['time:playing'] = 0;
    }
  });

  watchEffect(() => {
    if (audio.initiated) {
      layers.time = {
        volume: 1,
        signal: createTimeSignal()
      };
      render('time');
    }
  });

  function createTimeSignal() {
    const timer = el.time();
    const sampleRate = el.sr();

    const seconds = el.div(timer, sampleRate);
    const minutes = el.div(seconds, 60);
    const hours = el.div(minutes, 60);

    const started = el.const({ key: 'time:start', value: transport.started });
    const paused = el.const({ key: 'time:pause', value: transport.paused });

    const isStarted = el.ge(started, 0);
    const isPaused = el.ge(paused, 0);
    const isPlaying = el.and(isStarted, el.sub(1, isPaused));

    const current = el.select(isStarted, el.select(isPaused, el.sub(paused, started), el.sub(seconds, started)), 0);

    const bpm = cv['time:bpm'];
    const bps = el.div(bpm, 60);

    const beats = el.mul(current, bps);
    const beat = el.mod(beats, 1);
    const pulse = el.le(beat, 0.5);

    const steps = cv['time:steps'];
    const measures = el.div(beats, steps);
    const measure = el.mod(measures, 1);

    const step = el.mod(beats, steps);
    const stepNum = el.floor(step);
    const firstStep = el.le(stepNum, 1);
    const stepEven = el.mod(stepNum, 2);
    const stepOdd = el.eq(stepEven, 0);

    const pitch = el.mod(el.const({ key: 'time:pitch', value: freqPitch(controls['time:bpm'] / 60) }), 12);

    const hat = hatSynth(pitch, el.add(1000, el.mul(1500, stepEven)), 0.001, el.add(0.01, el.mul(0.06, firstStep)), el.mul(cv['time:click'], pulse));
    const metronome = el.mul(cv['time:volume'], hat);

    const silent = el.mul(0, el.add(measure, pitch, stepOdd, pulse, current, isPlaying, minutes, hours));

    return [
      el.meter({ name: 'time:metronome' }, metronome),
      el.meter({ name: 'time:silent' }, el.add(metronome, silent))
    ];
  }

  const time = computed(() => {
    if (!audio.meters) return {};
    return Object.fromEntries(
      Object.entries(audio.meters)
        .filter(([key]) => key.startsWith('time:'))
        .map(([key, value]) => [key.slice(5), value.max])
        .sort(([a], [b]) => a < b ? -1 : 1)
    );
  });

  return { controls, cv, groups, audio, render, transport, time, timeEnabled };
}