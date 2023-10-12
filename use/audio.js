/**
 * @module Audio
 * @description Main audio bus controller
 */

import { getDestination, start, gainToDb, Meter, context, Reverb, Limiter, Volume, Context, } from "tone"
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
    master.context = new Context().rawContext
    master.destination = getDestination()
    const { recorder } = useRecorder()

    master.stream = markRaw(context.createMediaStreamDestination())
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

export function createChannel(title = (Math.random() * 1000).toFixed(0), options) {
  const { master } = useAudio()
  const volume = new Volume().connect(master.limiter)
  const { recorder } = useRecorder()
  volume.connect(recorder)
  const channel = new Limiter(options).connect(volume)

  return channels[title] = { channel, volume }
}


export function initGetUserMedia() {
  //@ts-expect-error Polyfill for webkit
  window.AudioContext = window.AudioContext || window?.webkitAudioContext;
  if (!window.AudioContext) {
    return alert("AudioContext not supported");
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    //@ts-expect-error Fallback
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      //@ts-expect-error mozGetUserMedia
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert("getUserMedia is not implemented in this browser");
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}
