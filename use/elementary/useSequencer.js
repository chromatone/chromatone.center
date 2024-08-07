import { reactive, computed, watch } from 'vue';
import { el } from '@elemaudio/core';
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { kickSynth, hatSynth, clapSynth } from './useDrums'
import { useElementary } from './useElementary';

export function useSequencer() {

  const sequencer = reactive({
    mute: false,
    playing: false,
    reset: 0,
    volume: useClamp(useStorage('seq:volume', 0.7), 0, 1),
    bpm: useStorage('seq:bpm', 120),
    interval: computed(() => 60000 / sequencer.bpm),
    tracks: {
      hhat: Array(16).fill(1),
      clap: Array(16).fill(0),
      kick: Array(16).fill(0),
    },
    hit: {
      hhat: 0,
      clap: 0,
      kick: 0,
    },
    train: computed(() => el.train({ key: 'seq:train' },
      el.sm(
        el.const({
          key: 'seq:freq',
          value: sequencer.playing ? sequencer.bpm / 15 : 0
        }))))
  })

  watch(sequencer, s => {
    const { audio, render } = useElementary()

    // const metro = el.metro({ interval: s.interval })
    const reset = el.const({ key: 'seq:reset', value: 0 })

    const all = el.mul(
      el.const({
        key: 'seq:volume',
        value: sequencer.volume
      }),
      el.scope(
        { name: 'drums', size: 512 },
        el.add(
          kickSynth(30, 0.254, 0.05, 0.4, 4,
            el.or(
              el.const({
                key: 'hit:kick',
                value: sequencer.hit.kick
              }),
              el.seq2({
                key: 'seq:kick',
                seq: [...s.tracks.kick]
              }, sequencer.train, reset))),
          clapSynth(800, 0.005, 0.204,
            el.or(
              el.const({
                key: 'hit:clap',
                value: sequencer.hit.clap
              }), el.seq2({ key: 'seq:clap', seq: [...s.tracks.clap] }, sequencer.train, reset))),
          hatSynth(317, 12000, 0.005, 0.1,
            el.or(
              el.const({
                key: 'hit:hhat',
                value: sequencer.hit.hhat
              }), el.seq2({ key: 'seq:hh', seq: [...s.tracks.hhat] }, sequencer.train, reset))),
        )))

    audio.layers.seq = { signal: [all, all] }
    audio.started = false
    render('sequencer')
  })

  return { sequencer }
}