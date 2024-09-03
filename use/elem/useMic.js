import { watch, shallowReactive } from 'vue'
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useElementary, layers } from './useElementary';

const mic = shallowReactive({
  isOpen: false,
  stream: null,
  streamSource: null,
  gain: useClamp(1, 0, 10),
  gainRef: null,
  gainSetter: null,
})

async function openMic() {
  const { audio } = useElementary()
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
}

function closeMic() {
  if (mic.streamSource) {
    mic.streamSource.disconnect();
    mic.streamSource = null;
  }
  if (mic.stream) {
    mic.stream.getTracks().forEach(track => track.stop());
    mic.stream = null;
  }
}

function createMicSignal() {
  return el.mul(
    mic.gainRef || el.const({ key: 'mic:gain', value: mic.gain }),
    el.in({ channel: 0 })
  )
}

export function useMic() {
  const { audio, render } = useElementary()

  function initMicGainRef() {
    if (!audio.initiated) return;
    const [ref, setter] = audio.core.createRef("const", { value: mic.gain }, []);
    mic.gainRef = ref;
    mic.gainSetter = setter;
  }

  watch(() => audio.initiated, initMicGainRef, { immediate: true })

  watch(() => mic.gain, (newGain) => {
    if (mic.gainSetter) {
      mic.gainSetter({ value: newGain });
    }
  })

  watch(() => mic.isOpen, async (open) => {
    if (open) {
      await openMic();
    } else {
      setTimeout(closeMic, 400);
    }
    updateMicLayer();
  })

  function updateMicLayer() {
    const input = createMicSignal();
    layers.mic = {
      signal: mic.isOpen ? [el.scope({ name: 'mic', size: 512 }, input), input] : [0, 0]
    }
    render();
  }

  return mic
}