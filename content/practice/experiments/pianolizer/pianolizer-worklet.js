/**
 * SlidingDFT wrapper for the audio worklet API.
 *
 * @class PianolizerWorklet
 * @extends {AudioWorkletProcessor}
 */
class PianolizerWorklet extends AudioWorkletProcessor {
  /* global sampleRate, Pianolizer */

  /**
   * Creates an instance of PianolizerWorklet.
   * @memberof PianolizerWorklet
   */
  constructor (options) {
    super()

    this.samples = null // allocated according to the input length

    const {
      keysNum = 61,
      referenceKey = 33,
      pitchFork = 440.0,
      tolerance = 1.0
    } = options.processorOptions

    this.pianolizer = new Pianolizer(
      sampleRate,
      keysNum,
      referenceKey,
      pitchFork,
      tolerance
    )
  }

  /**
   * Definition of the 'smooth' parameter.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/parameterDescriptors}
   * @readonly
   * @static
   * @memberof PianolizerWorklet
   */
  static get parameterDescriptors () {
    return [{
      name: 'smooth',
      defaultValue: 0.04,
      minValue: 0,
      maxValue: 0.25,
      automationRate: 'k-rate'
    }, {
      name: 'threshold',
      defaultValue: 0.05,
      minValue: 0,
      maxValue: 1.0,
      automationRate: 'k-rate'
    }]
  }

  /**
   * SDFT processing algorithm for the audio processor worklet.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process}
   * @param {Array} input An array of inputs connected to the node, each item of which is, in turn, an array of channels. Each channel is a Float32Array containing N samples.
   * @param {Array} output Unused.
   * @param {Object} parameters We only need the value under the key 'smooth'.
   * @return {Boolean} Always returns true, so as to to keep the node alive.
   * @memberof PianolizerWorklet
   */
  process (input, output, parameters) {
    // if no inputs are connected then zero channels will be passed in
    if (input[0].length === 0) {
      return true
    }

    // I hope all the channels have the same # of samples; but 128 frames per block is
    // subject to change, even *during* the lifetime of an AudioWorkletProcessor instance!
    // WARNING: since this.samples is being reused, values must be set to zero after each iteration!!!
    const windowSize = input[0][0].length
    if (this.samples === null || this.samples.length !== windowSize) {
      this.samples = new Float32Array(windowSize)
    }

    // mix down the inputs into single array
    const inputPortCount = input.length
    for (let portIndex = 0; portIndex < inputPortCount; portIndex++) {
      const channelCount = input[portIndex].length
      for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
        for (let sampleIndex = 0; sampleIndex < windowSize; sampleIndex++) {
          const sample = input[portIndex][channelIndex][sampleIndex]
          // output[portIndex][channelIndex][sampleIndex] = sample
          this.samples[sampleIndex] += sample
        }
      }
    }

    // DO IT!!!
    const levels = this.pianolizer.process(this.samples, parameters.smooth[0])

    const bands = levels.length
    for (let i = 0; i < bands; i++) {
      if (levels[i] < parameters.threshold[0]) {
        levels[i] = 0
      }
    }
    this.port.postMessage(levels)

    return true
  }
}

registerProcessor('pianolizer-worklet', PianolizerWorklet)
