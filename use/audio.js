/**
 * @module Audio
 * @description Main audio bus controller
 */

import { getDestination, start, gainToDb, Meter, Reverb, Limiter, Volume, getContext } from "tone"
import { useRecorder } from "./recorder"
import { shallowReactive, reactive, watchEffect, markRaw } from 'vue'
import { useRafFn, useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"

const audio = reactive({
  initiated: false,
  mute: useStorage("mute", false),
  volume: useClamp(useStorage("main-vol", 1), 0, 2),
  meter: 0
})

export const master = reactive({})

export const channels = shallowReactive({})

export function useAudio() {
  if (!audio.initiated) {
    start()
    master.context = markRaw(new AudioContext())
    master.destination = getDestination()
    const { recorder } = useRecorder()

    master.stream = markRaw(getContext().createMediaStreamDestination())
    master.meter = markRaw(new Meter().toDestination())
    master.meter.normalRange = true
    master.meter.connect(master.stream)
    master.meter.connect(recorder)


    useRafFn(() => {
      audio.meter = master.meter.getValue()
    })

    master.limiter = markRaw(new Limiter(-18).connect(master.meter))

    master.reverb = markRaw(new Reverb({
      decay: 1,
      wet: 0.5
    }).connect(master.meter))

    master.limiter.connect(master.reverb)

    watchEffect(() => {
      master.destination.mute = audio.mute;
    });

    watchEffect(() => {
      master.destination.volume.targetRampTo(gainToDb(audio.volume), 0.1);
    });
    audio.initiated = true;
  }
  return { audio, master, channels }
}

export function createAudioChannel(title = (Math.random() * 1000).toFixed(0), options) {
  const { master } = useAudio()
  const volume = new Volume().connect(master.limiter)
  const { recorder } = useRecorder()
  volume.connect(recorder)
  const channel = new Limiter(options).connect(volume)
  return channels[title] = { channel, volume }
}


export function initGetUserMedia() {
  window.AudioContext = window.AudioContext || window?.webkitAudioContext;
  if (!window.AudioContext) {
    return alert("AudioContext not supported");
  }

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        alert("getUserMedia is not implemented in this browser");
      }

      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}
