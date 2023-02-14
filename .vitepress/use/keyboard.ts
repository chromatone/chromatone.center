/**
 * @module Keyboard
 */

import { midi, playKey } from "./midi"

const noteKeys = {

  'KeyQ': { note: 'F', offset: 1 },
  'Digit2': { note: 'F#', offset: 1 },
  'KeyW': { note: 'G', offset: 1 },
  'Digit3': { note: 'G#', offset: 1 },
  'KeyE': { note: 'A', offset: 1 },
  'Digit4': { note: 'A#', offset: 1 },
  'KeyR': { note: 'B', offset: 1 },
  'KeyT': { note: 'C', offset: 2 },
  'Digit6': { note: 'C#', offset: 2 },
  'KeyY': { note: 'D', offset: 2 },
  'Digit7': { note: 'D#', offset: 2 },
  'KeyU': { note: 'E', offset: 2 },
  'KeyI': { note: 'F', offset: 2 },
  'Digit9': { note: 'F#', offset: 2 },
  'KeyO': { note: 'G', offset: 2 },
  'Digit0': { note: 'G#', offset: 2 },
  'KeyP': { note: 'A', offset: 2 },
  'Minus': { note: 'A#', offset: 2 },
  'BracketLeft': { note: 'B', offset: 2 },
  'BracketRIght': { note: 'C', offset: 3 },

  'KeyZ': { note: 'C', offset: 0 },
  'KeyS': { note: 'C#', offset: 0 },
  'KeyX': { note: 'D', offset: 0 },
  'KeyD': { note: 'D#', offset: 0 },
  'KeyC': { note: 'E', offset: 0 },
  'KeyV': { note: 'F', offset: 0 },
  'KeyG': { note: 'F#', offset: 0 },
  'KeyB': { note: 'G', offset: 0 },
  'KeyH': { note: 'G#', offset: 0 },
  'KeyN': { note: 'A', offset: 0 },
  'KeyJ': { note: 'A#', offset: 0 },
  'KeyM': { note: 'B', offset: 0 },
  'Comma': { note: 'C', offset: 1 },
  'KeyL': { note: 'C#', offset: 1 },
  'Period': { note: 'D', offset: 1 },
  'Semicolon': { note: 'D#', offset: 1 },
  'Slash': { note: 'E', offset: 1 },

}


export function setupKeyboard() {

  document.addEventListener('keydown', e => {
    if (e.code == 'Digit1') midi.offset--
    if (e.code == 'Equal') midi.offset++
    if (e.repeat || !midi.keyboard || !noteKeys[e.code]) return
    if (e.ctrlKey || e.altKey || e.metaKey) return
    if (e.code == 'Slash') e.preventDefault()
    playKey(noteKeys[e.code].note, noteKeys[e.code].offset)
  })

  document.addEventListener('keyup', e => {
    if (!noteKeys[e.code]) return
    playKey(noteKeys[e.code].note, noteKeys[e.code].offset, true)
  })
}
