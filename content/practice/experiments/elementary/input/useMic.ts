import { onMounted, watch, computed, ref, reactive, shallowReactive } from 'vue'
import { useAudio } from '../useAudio'
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
      mic.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

  watchEffect(() => {
    const input = el.scope(
      { name: 'mic', size: 512 },
      el.mul(
        el.const({ key: 'mic:gain', value: mic.gain.value }),
        el.in({ key: 'mic:in', channel: 0 })
      )
    )

    audio.layers.mic = mic.isOpen ? [input, input] : [0, 0]
    render()
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