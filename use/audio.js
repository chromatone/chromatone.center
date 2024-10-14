/**
 * @module Audio
 * @description Main audio bus controller for managing audio channels, effects, and settings.
 */

import { getDestination, start, gainToDb, Meter, Reverb, Limiter, Volume, getContext } from "tone";
import { useRecorder } from "./recorder";
import { shallowReactive, reactive, watchEffect, markRaw } from 'vue';
import { useRafFn, useStorage } from "@vueuse/core";
import { useClamp } from "@vueuse/math";

/**
 * @typedef {Object} AudioState
 * @property {boolean} initiated - Indicates if the audio system has been initiated.
 * @property {boolean} mute - Indicates if the audio is muted.
 * @property {number} volume - The main volume level (0 to 2).
 * @property {number} meter - The current meter reading.
 */

/**
 * @type {AudioState}
 */
const audio = reactive({
  initiated: false,
  mute: useStorage("mute", false),
  volume: useClamp(useStorage("main-vol", 1), 0, 2),
  meter: 0
});

/**
 * @typedef {Object} MasterChannel
 * @property {AudioContext} context - The main audio context.
 * @property {Object} destination - The main audio destination.
 * @property {MediaStreamAudioDestinationNode} stream - The media stream destination.
 * @property {Object} meter - The audio meter.
 * @property {Object} limiter - The main limiter.
 * @property {Object} reverb - The main reverb effect.
 */

/** @type {MasterChannel} */
export const master = reactive({});

/**
 * @typedef {Object} AudioChannel
 * @property {Object} channel - The channel's limiter.
 * @property {Object} volume - The channel's volume control.
 */

/**
 * @type {Object.<string, AudioChannel>}
 */
export const channels = shallowReactive({});

/**
 * Initialize and manage the main audio system.
 * @returns {{audio: AudioState, master: MasterChannel, channels: Object.<string, AudioChannel>}}
 */
export function useAudio() {
  if (!audio.initiated) {
    start();
    master.context = markRaw(new AudioContext());
    master.destination = getDestination();
    const { recorder } = useRecorder();

    master.stream = markRaw(getContext().createMediaStreamDestination());
    master.meter = markRaw(new Meter().toDestination());
    master.meter.normalRange = true;
    master.meter.connect(master.stream);
    master.meter.connect(recorder);

    useRafFn(() => {
      audio.meter = master.meter.getValue();
    });

    master.limiter = markRaw(new Limiter(-18).connect(master.meter));

    master.reverb = markRaw(new Reverb({
      decay: 1,
      wet: 0.5
    }).connect(master.meter));

    master.limiter.connect(master.reverb);

    watchEffect(() => {
      master.destination.mute = audio.mute;
    });

    watchEffect(() => {
      master.destination.volume.targetRampTo(gainToDb(audio.volume), 0.1);
    });
    audio.initiated = true;
  }
  return { audio, master, channels };
}

/**
 * Create a new audio channel with a limiter and volume control.
 * @param {string} title - The channel title. Defaults to a random number.
 * @param {Object} options - Options for the Limiter constructor.
 * @returns {AudioChannel} The created channel object.
 */
export function createAudioChannel(title = (Math.random() * 1000).toFixed(0), options) {
  const { master } = useAudio();
  const volume = new Volume().connect(master.limiter);
  const { recorder } = useRecorder();
  volume.connect(recorder);
  const channel = new Limiter(options).connect(volume);
  return channels[title] = { channel, volume };
}

/**
 * Initialize getUserMedia for cross-browser compatibility.
 * @throws {Error} If AudioContext or getUserMedia is not supported.
 */
export function initGetUserMedia() {
  if (typeof window === 'undefined') return;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!window.AudioContext) {
    throw new Error("AudioContext not supported");
  }

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        throw new Error("getUserMedia is not implemented in this browser");
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}