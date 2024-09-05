<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PianolizerWorklet } from './pianolizer-wasm.js'

const levels = ref(new Float32Array(61))
const audioContext = ref(null)
const pianolizerNode = ref(null)

// Function to set up the audio context and pianolizer worklet
const setupAudio = async () => {
  // Create a new AudioContext
  audioContext.value = new (window.AudioContext || window.webkitAudioContext)()

  // Load the Pianolizer WASM module
  const pianolizerWasm = await PianolizerWorklet()

  // Add the worklet module to the audio context
  await audioContext.value.audioWorklet.addModule('pianolizer-worklet.js')

  // Create the pianolizer AudioWorkletNode
  pianolizerNode.value = new AudioWorkletNode(audioContext.value, 'pianolizer-worklet', {
    processorOptions: {
      wasmModule: pianolizerWasm,
      sampleRate: audioContext.value.sampleRate,
      keysNum: 61,
      pitchFork: 440.0,
      tolerance: 1.0
    }
  })

  // Set up the message handler to receive level data from the worklet
  pianolizerNode.value.port.onmessage = (event) => {
    levels.value = event.data
  }
}

// Function to start capturing and processing microphone input
const startMicrophoneCapture = async () => {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    // Create a media stream source from the microphone input
    const source = audioContext.value.createMediaStreamSource(stream)

    // Connect the source to the pianolizer node
    source.connect(pianolizerNode.value)

    // Connect the pianolizer node to the audio context destination (optional, for monitoring)
    // pianolizerNode.value.connect(audioContext.value.destination)
  } catch (error) {
    console.error('Error accessing microphone:', error)
  }
}

// Set up the audio context and start microphone capture when the component is mounted
onMounted(async () => {
  await setupAudio()
  await startMicrophoneCapture()
})

// Clean up the audio context when the component is unmounted
onUnmounted(() => {
  if (audioContext.value) {
    audioContext.value.close()
  }
})
</script>

<template>
  <div>
    <h2>Pianolizer WASM Output</h2>
    <pre>{{ JSON.stringify(Array.from(levels), null, 2) }}</pre>
  </div>
</template>