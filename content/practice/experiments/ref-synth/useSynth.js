import { el } from '@elemaudio/core';
import { ref, watch, reactive, watchEffect } from 'vue';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';

import { useElementary } from '#/use/elementary/useElementary.js';
import { useMidi, useTempo } from '#/use';

const params = {
  "osc:volume": { "value": 0.2, "min": 0, "max": 1, "step": 0.01 },
  "osc:shape": { "value": 0.2, "min": 0, "max": 1, "step": 0.01 },

  "fx:pingPong": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:feedback": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:shift": { "value": 0.4, "min": 0, "max": 1, "step": 0.01 },

  "fx:bpm": { "value": 120, "min": 10, "max": 500, "step": 1, "hidden": true }
}

export function useSynth(count = 12) {
  const started = ref(false)

  const { controls, cv, groups } = useParams(params, 'ref')

  const voiceParams = {}

  for (let num = 0; num < count; num++) {
    voiceParams[`v${num}:gate`] = { value: 0, min: 0, max: 1, step: 1 }
    voiceParams[`v${num}:midi`] = { value: 0, min: 0, max: 127, step: 1 }
    voiceParams[`v${num}:vel`] = { value: 0, min: 0, max: 127, step: 1 }
  }

  const { controls: voiceControls, cv: voiceCVs, groups: voiceGroups } = useParams(voiceParams, 'ref')

  const voices = reactive(Array(count).fill(true).map((_, i) => ({
    key: `v${i}`,
    gate: 0.0,
    midi: 69,
    vel: 0
  })))


  watch(voices, vs => {
    for (let voice of vs) {
      voiceControls[`${voice.key}:gate`] = voice.gate
      voiceControls[`${voice.key}:midi`] = voice.midi
      voiceControls[`${voice.key}:vel`] = voice.vel
    }
  })

  const next = ref(0)
  const overflow = ref(0)

  function cycleNote(num = 60, velocity = 0) {
    if (velocity) {
      do {
        next.value++
        if (next.value >= voices.length) {
          next.value = 0
          overflow.value++
        }
        if (overflow.value > 3) break;
      } while (voices[next.value].gate == 1)
      overflow.value = 0
      voices[next.value]['gate'] = 1;
      voices[next.value]['midi'] = num;
      voices[next.value]['vel'] = velocity;
    } else {
      voices.forEach(v => {
        if (v.midi == num) {
          v.gate = 0
          v.vel = 0
        }
      })
    }
  }

  function stopAll(num) {
    voices.forEach(v => v.gate = 0)
  }

  const tempo = useTempo()
  watchEffect(() => {
    controls['fx:bpm'] = tempo.bpm
  })

  const { midi } = useMidi()

  watch(() => midi.note, n => cycleNote(n.number, n.velocity))

  const { audio, render } = useElementary()
  watchEffect(() => {
    if (audio.initiated) {

      audio.layers.saw = {
        volume: .7,
        signal: pingPong(poly(voices))
      }
    }
  })


  function poly() {

    return el.mul(
      cv['osc:volume'],
      el.mul(
        el.sqrt(
          el.const({
            key: 'voice-count',
            value: 1 / voices.length
          })),
        el.add(...voices.map(
          voice => el.mul(
            el.adsr(
              1,
              2,
              0.5,
              2,
              voiceCVs[`${voice.key}:gate`]),
            el.div(voiceCVs[`${voice.key}:vel`], 127),
            el.add(
              el.mul(
                el.sub(
                  1,
                  cv['osc:shape']
                ),
                el.blepsquare(
                  midiFrequency(voiceCVs[`${voice.key}:midi`])
                )
              ),
              el.mul(
                cv['osc:shape'],
                el.blepsaw(midiFrequency(voiceCVs[`${voice.key}:midi`]))
              )
            )
          )
        )
        )
      )
    )
  }


  function pingPong(x) {
    return Array(2).fill(null).map((n, i) => el.add(
      x,
      el.mul(
        cv['fx:pingPong'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i == 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          x))))
  }

  return { controls, cv, groups, audio, render, started, voices, cycleNote, stopAll }
}


export function midiFrequency(x) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.div(
          el.sub(x, 69),
          12
        )
      )
    )
  )
}



export function useParams(params, title = 'ref') {

  const { audio } = useElementary()

  const controls = reactive({})
  const cv = {}
  const setters = {}
  const groups = {}


  for (let p in params) {
    let param = params[p]
    controls[p] = useClamp(param?.nostore ? param.value : useStorage(`${title}:${p}`, param.value), param.min, param.max)
    if (!param?.hidden) {
      const split = p.split(':')
      const name = split.pop()
      const group = split.pop()
      groups[group] = groups[group] || {}
      groups[group][name] = param
    }
  }

  watch(() => audio.initiated, () => {
    if (!audio.initiated) return
    for (let p in params) {
      let [node, setter] = audio.core.createRef("const", { value: controls[p] }, []);
      cv[p] = node
      setters[p] = setter
    }
  }, { immediate: true })

  watch(controls, cs => {
    for (let c in cs) {
      if (!setters[c]) continue
      setters[c]({ value: cs[c] })
    }
  })

  return { controls, cv, setters, groups }
}