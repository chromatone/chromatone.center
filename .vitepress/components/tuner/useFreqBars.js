import { ref, onMounted } from 'vue'

export function useFreqBars() {
  const freqBars = ref()

  onMounted(() => {
    freqBars.value.width = document.body.clientWidth
    freqBars.value.height = document.body.clientHeight / 2
  })

  /**
   * @param {Uint8Array} data
   */
  function updateFreqBars(data) {
    const canvasContext = freqBars.value.getContext('2d')
    const length = 64 // low frequency only
    const width = this.$canvas.width / length - 0.5
    canvasContext.clearRect(0, 0, freqBars.value.width, freqBars.value.height)
    for (var i = 0; i < length; i += 1) {
      canvasContext.fillStyle = '#ecf0f1'
      canvasContext.fillRect(
        i * (width + 0.5),
        freqBars.value.height - data[i],
        width,
        data[i],
      )
    }
  }

  return { freqBars, updateFreqBars }
}
