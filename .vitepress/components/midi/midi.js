import { reactive, onBeforeUnmount, onMounted } from 'vue'
import { WebMidi } from 'webmidi'

const channels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export function useMidi() {
  const state = reactive({
    enabled: false,
    input: {},
    output: {},
  })

  WebMidi.enable()

  WebMidi.addListener('enabled', (e) => {
    state.enabled = true
  })

  WebMidi.addListener('connected', (e) => {
    state.enabled = true
    state[e.port.type][e.port.id] = {
      name: e.port.name,
      manufacturer: e.port.manufacturer,
      playing: null,
    }
    if (e.port.type == 'input') {
      e.port.addListener('start', () => {
        state[e.port.type][e.port.id].playing = true
      })
      e.port.addListener('stop', () => {
        state[e.port.type][e.port.id].playing = false
      })
      e.port.addListener(
        'noteon',
        (msg) => {
          console.log(msg)
        },
        { channels },
      )
    }
  })

  WebMidi.addListener('disconnected', (e) => {
    delete state[e.port.type][e.port.id]
  })

  onBeforeUnmount(() => {
    WebMidi.disable()
  })

  return {
    state,
    WebMidi,
  }
}
