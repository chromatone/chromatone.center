import { onMounted, watch, computed, ref, reactive, shallowReactive } from 'vue'
import { useAudio } from './useAudio'
import { el } from '@elemaudio/core';

const mic = shallowReactive({
  isOpen: false,
  stream: null,
  streamSource: null,
  async open() {
    const audio = useAudio()
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
  const audio = useAudio()

  audio.layers.mic = [el.in({ channel: 0 }), el.in({ channel: 0 })]

  watch(() => mic.isOpen, open => {
    if (open) {
      mic.open()
    } else {
      mic.close()
    }
  })

  return mic
}