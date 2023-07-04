import { onMounted, watch, computed, ref, reactive, shallowReactive } from 'vue'
import { useAudio } from './useAudio'

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
  watch(() => mic.isOpen, open => {
    if (open) {
      mic.open()
    }
  })

  return mic
}