import { getDestination, start, gainToDb, Meter, context, Reverb, Limiter } from "tone";
import { useRecorder } from "./recorder";
import { shallowReactive, reactive, watchEffect } from 'vue'
import { useRafFn, useStorage } from "@vueuse/core";
import { useClamp } from "@vueuse/math";

const audio = reactive({
  initiated: false,
  mute: useStorage("mute", false),
  volume: useClamp(useStorage("main-vol", 1), 0, 2),
  meter: 0
});

export const master = shallowReactive({})

export const channels = shallowReactive({})

export function useAudio() {
  if (!audio.initiated) {
    start()

    const { recorder } = useRecorder()

    master.stream = context.createMediaStreamDestination()

    master.meter = new Meter().toDestination();
    master.meter.normalRange = true
    master.meter.connect(master.stream)
    master.meter.connect(recorder)

    useRafFn(() => {
      audio.meter = master.meter.getValue()
    })

    master.limiter = new Limiter(-18).connect(master.meter)


    master.reverb = new Reverb({
      decay: 1,
      wet: 0.5
    }).connect(master.meter)
    master.limiter.connect(master.reverb)


    watchEffect(() => {
      getDestination().mute = audio.mute;
    });

    watchEffect(() => {
      getDestination().volume.targetRampTo(gainToDb(audio.volume), 0.1);
    });
    audio.initiated = true;
  }

  return { audio, master, channels };
}

export function createChannel(title = (Math.random() * 1000).toFixed(0), options) {
  const { master } = useAudio()
  const channel = new Limiter(options).connect(master.limiter)
  channels[title] = channel


  return channel
}


export function initGetUserMedia() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!window.AudioContext) {
    return alert("AudioContext not supported");
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
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
