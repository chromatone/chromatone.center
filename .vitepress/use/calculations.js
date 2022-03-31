export const midiA = 69

export function pitchNoteOctave(pitch) {
  return {
    note: pitch > 0 ? pitch % 12 : 12 + (pitch % 12),
    octave: Math.floor(pitch / 12) + 4,
  }
}

export function pitchFreq(
  pitch = 0,
  octave = 3,
  middleA = 440,
  tuning = 'equal',
) {
  let hz = 0
  const justCents = [0, 112, 204, 316, 386, 498, 590, 702, 814, 884, 1017, 1088]
  if (tuning == 'equal') {
    hz = Number(middleA * Math.pow(2, octave - 3 + pitch / 12))
  }
  if (tuning == 'just') {
    let diff = Number(Math.pow(Math.pow(2, 1 / 1200), justCents[pitch]))
    hz = Number(middleA * Math.pow(2, octave - 4) * diff)
  }
  return hz
}

export function pitchColor(pitch = 0, octave, velocity = 1, alpha = 1) {
  octave = octave || Math.floor(pitch / 12) + 4
  return `hsla(${(pitch % 12) * 30},${velocity * 100}%,${
    Math.abs(octave + 2) * 8
  }%,${alpha})`
}

export function freqColor(freq) {
  return pitchColor(freqPitch(freq))
}

export function freqPitch(freq, middleA = 440) {
  return 12 * (Math.log(freq / middleA) / Math.log(2))
}

export function isInChroma(chroma, tonic, note) {
  return chroma.split('')[(24 + note - tonic) % 12] == '1'
}

export function getCircleCoord(n = 0, total = 12, radius = 35, width = 100) {
  let angle = ((n - total / 4) / (total / 2)) * Math.PI // Calculate the angle at which the element will be placed.
  // For a semicircle, we would use (i / numNodes) * Math.PI.
  let x = radius * Math.cos(angle) + width / 2 // Calculate the x position of the element.
  let y = radius * Math.sin(angle) + width / 2 // Calculate the y position of the element.
  return { x, y }
}

export function rotateArray(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)]
}

export function clampNum(main, delta, min = 0, max = 100) {
  return Math.max(min, Math.min(Number(main) + Number(delta), max));
}