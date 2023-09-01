import { onMounted, watch, computed, ref, reactive, shallowReactive } from 'vue'
import { useAudio } from '../audio/useAudio'
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { watchEffect } from 'vue';

const mic = shallowReactive({
  isOpen: false,
  stream: null,
  streamSource: null,
  gain: useClamp(1, 0, 10),
  async open() {
    const { audio } = useAudio()
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      mic.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
        }
      });
      mic.streamSource = audio.ctx.createMediaStreamSource(mic.stream);
      mic.streamSource.connect(audio.node);
    }
  },
  close() {
    mic.streamSource.disconnect()
  }
})

export function useMic() {
  const { audio, render } = useAudio()

  const input =
    el.mul(
      el.const({ key: 'mic:gain', value: mic.gain.value }),
      el.in({ key: 'mic:in', channel: 0 })
    )

  watch(mic, () => {
    audio.layers.mic = {
      signal: mic.isOpen ? [el.scope(
        { name: 'mic', size: 512 }, input), input] : [0, 0]
    }
    render('mic')
  })

  watch(() => mic.isOpen, open => {
    if (open) {
      mic.open()
    } else {

      setTimeout(() => {
        mic.close()
      }, 400);
    }
  })

  return mic
}