import { PianoKeyboard, Spectrogram, Palette } from './visualization.js'

const HEIGHT = 'height'
const PUREJS = 'purejs'
const PITCHFORK = 'pitchfork'
const TOLERANCE = 'tolerance'

let audioContext, audioSource, microphoneSource, pianolizer
let levels, midi, palette

const audioElement = document.getElementById('input')
const playToggle = document.getElementById('play-toggle')
const sourceSelect = document.getElementById('source')
const rotationInput = document.getElementById('rotation')
const smoothingInput = document.getElementById('smoothing')
const thresholdInput = document.getElementById('threshold')

const searchParams = new URLSearchParams(window.location.search)

function loadSettings (reset = false) {
  if (reset === true) {
    localStorage.clear()
  }

  const inputEvent = new Event('input')

  rotationInput.value = localStorage.getItem('rotation') || 0
  rotationInput.dispatchEvent(inputEvent)

  smoothingInput.value = Math.pow(localStorage.getItem('smoothing') || 0.040, 1 / 3)
  smoothingInput.dispatchEvent(inputEvent)

  thresholdInput.value = Math.pow(localStorage.getItem('threshold') || 0.050, 1 / 3)
  thresholdInput.dispatchEvent(inputEvent)
}

async function loadLocalFile () {
  const fileHandles = await window.showOpenFilePicker({
    types: [
      {
        description: 'Audio',
        accept: {
          'audio/*': ['.mp3', '.flac', '.ogg', '.wav']
        }
      }
    ],
    excludeAcceptAllOption: true,
    multiple: false
  })
  const fileData = await fileHandles[0].getFile()
  audioElement.src = URL.createObjectURL(fileData)
}

async function setupAudio () {
  if (audioContext === undefined) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // Thanks for nothing, Firefox!
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1572644
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1636121
    // https://github.com/WebAudio/web-audio-api-v2/issues/109#issuecomment-756634198
    const fetchText = url => fetch(url).then(response => response.text())
    const pianolizerImplementation = searchParams.has(PUREJS)
      ? 'js/pianolizer.js'
      : 'js/pianolizer-wasm.js'
    const modules = await Promise.all([
      fetchText(pianolizerImplementation),
      fetchText('js/pianolizer-worklet.js')
    ])
    const blob = new Blob(modules, { type: 'application/javascript' })
    await audioContext.audioWorklet.addModule(URL.createObjectURL(blob))

    const processorOptions = {
      pitchFork: parseFloat(searchParams.get(PITCHFORK)) || 440.0,
      tolerance: parseFloat(searchParams.get(TOLERANCE)) || 1.0
    }
    pianolizer = new AudioWorkletNode(audioContext, 'pianolizer-worklet', { processorOptions })
    pianolizer.port.onmessage = event => {
      // TODO: use SharedArrayBuffer for syncing levels
      levels.set(event.data)
    }

    audioSource = audioContext.createMediaElementSource(audioElement)
    audioSource.connect(pianolizer)
  }

  audioSource.connect(audioContext.destination)
  pianolizer.parameters.get('smooth').value = Math.pow(parseFloat(smoothingInput.value), 3)
  pianolizer.parameters.get('threshold').value = Math.pow(parseFloat(thresholdInput.value), 3)
}

async function setupMicrophone (deviceId) {
  await setupAudio()
  audioSource.disconnect(audioContext.destination)

  if (microphoneSource === undefined) {
    await navigator.mediaDevices.getUserMedia({ audio: { deviceId }, video: false })
      .then(stream => {
        microphoneSource = audioContext.createMediaStreamSource(stream)
        microphoneSource.connect(pianolizer)

        // for whatever reason, once selected, the input can't be switched
        const selectedLabel = '*' + deviceId
        for (const option of sourceSelect.options) {
          if (option.value.charAt(0) === '*' && option.value !== selectedLabel) {
            option.disabled = true
          }
        }
      })
      .catch(error => window.alert('Audio input access denied: ' + error))
  } else {
    microphoneSource.connect(pianolizer)
  }
}

function setupMIDI () {
  if (navigator.requestMIDIAccess === undefined) {
    return
  }

  navigator.requestMIDIAccess()
    .then(
      midiAccess => {
        // connecting MIDI to input function
        for (const input of midiAccess.inputs.values()) {
          input.onmidimessage = message => {
            const firstNoteIndex = 36
            const [command, note, velocity] = message.data
            switch (command) {
              case 0x90:
                midi[note - firstNoteIndex] = velocity / 0x7f
                break
              case 0x80:
                midi[note - firstNoteIndex] = 0
                break
            }
          }
        }

        sourceSelect.add(new Option('MIDI input only', '#'))
      })
}

function setupUI () {
  const playRestart = document.getElementById('play-restart')
  const pianolizerUI = document.getElementById('pianolizer')

  sourceSelect.onchange = event => {
    audioElement.pause()
    playToggle.innerText = 'Play'

    const selectedValue = event.target.value
    if (selectedValue.charAt(0) === '*') {
      // microphone source
      playToggle.disabled = true
      playRestart.disabled = true
      setupMicrophone(selectedValue.substring(1))
    } else {
      // <audio> element source
      playToggle.disabled = false
      playRestart.disabled = false
      try { microphoneSource.disconnect(pianolizer) } catch { console.warn('Microphone was not connected') }
      audioElement.style['pointer-events'] = 'auto'
      if (selectedValue === '/') {
        // only Chrome & Opera can do this at the time of writing
        loadLocalFile()
      } else if (selectedValue === '#') {
        // "MIDI solo" mode
        playToggle.disabled = true
        playRestart.disabled = true
        levels.fill(0.0)
      } else {
        audioElement.src = `${selectedValue}?_=${Date.now()}` // never cache
      }
    }
  }

  playToggle.onclick = async event => {
    if (audioElement.paused) {
      await setupAudio()
      audioElement.play()
      playToggle.innerText = 'Pause'
    } else {
      audioElement.pause()
      playToggle.innerText = 'Play'
    }
  }

  playRestart.onclick = event => {
    audioElement.load()
    playToggle.innerText = 'Play'
  }

  rotationInput.oninput = event => {
    const value = parseInt(event.target.value)
    localStorage.setItem('rotation', value)
    palette.rotation = value
  }

  smoothingInput.oninput = event => {
    const value = Math.pow(parseFloat(event.target.value), 3)
    localStorage.setItem('smoothing', value)
    document.getElementById('smoothing-value').innerText = `${value.toFixed(3)}s`
    if (pianolizer !== undefined) {
      pianolizer.parameters.get('smooth').value = value
    }
  }

  thresholdInput.oninput = event => {
    const value = Math.pow(parseFloat(event.target.value), 3)
    localStorage.setItem('threshold', value)
    document.getElementById('threshold-value').innerText = value.toFixed(3)
    if (pianolizer !== undefined) {
      pianolizer.parameters.get('threshold').value = value
    }
  }

  pianolizerUI.ondragover = event => {
    event.preventDefault()
  }

  pianolizerUI.ondrop = event => {
    event.preventDefault()
    if (event.dataTransfer.items) {
      for (const item of event.dataTransfer.items) {
        if (item.kind === 'file' && item.type.match('^audio/(flac|mpeg|ogg|x-wav)$')) {
          audioElement.pause()
          playToggle.innerText = 'Play'

          const fileData = item.getAsFile()
          audioElement.src = URL.createObjectURL(fileData)

          sourceSelect.value = '?'
          document.getElementById('drop-label').innerText = fileData.name
          break
        }
      }
      event.dataTransfer.items.clear()
    } else {
      console.warn('DataTransferItemList interface unavailable')
    }
  }

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(() => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          devices.filter(device => device.kind === 'audioinput')
            .reverse()
            .forEach(device => {
              sourceSelect.add(
                new Option('Input: ' + device.label, '*' + device.deviceId),
                0
              )
            })
        })
    })

  if (window.showOpenFilePicker !== undefined) {
    sourceSelect.add(
      new Option('Load local audio file', '/'),
      0
    )
  }

  const implementationWASM = document.getElementById('implementation-wasm')
  implementationWASM.onclick = () => {
    searchParams.delete(PUREJS)
    window.location.search = searchParams.toString()
  }
  const implementationPureJS = document.getElementById('implementation-purejs')
  implementationPureJS.onclick = () => {
    searchParams.set(PUREJS, true)
    window.location.search = searchParams.toString()
  }
  if (searchParams.has(PUREJS)) {
    implementationPureJS.checked = true
  } else {
    implementationWASM.checked = true
  }
}

async function app () {
  function draw (currentTimestamp) {
    if (playToggle.disabled || !audioElement.paused) {
      const audioColors = palette.getKeyColors(levels)
      const midiColors = palette.getKeyColors(midi)
      pianoKeyboard.update(audioColors, midiColors)
      spectrogram.update(audioColors, midiColors)
    }
    window.requestAnimationFrame(draw)
  }

  const paletteData = await fetch('palette.json').then(response => response.json())
  palette = new Palette(paletteData)

  const pianoKeyboard = new PianoKeyboard(document.getElementById('keyboard'))
  pianoKeyboard.drawKeyboard()
  const spectrogram = new Spectrogram(
    document.getElementById('spectrogram'),
    pianoKeyboard.keySlices,
    parseInt(searchParams.get(HEIGHT)) || 600
  )

  levels = new Float32Array(pianoKeyboard.keysNum)
  midi = new Float32Array(pianoKeyboard.keysNum)

  setupMIDI()
  setupUI()
  loadSettings()

  window.requestAnimationFrame(draw)
}

app()
