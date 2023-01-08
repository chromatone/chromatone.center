<script setup>
import { watchDebounced } from '@vueuse/core'
import { state } from './state.js'
import { notes } from '#/use/theory'
import { noteColor } from "#/use/colors"
import tunes from './tunes.js'
const notation = useStorage('abc-notes', tunes['kalinka']);

onMounted(() => {
  import('abcjs').then(ABCJS => {
    new ABCJS.Editor("abc", {

      canvas_id: "paper",
      warnings_id: "warnings",
      staffwidth: 200,
      synth: {
        el: "#audio",
        options: { displayLoop: true, displayRestart: true, displayPlay: true, displayProgress: true, displayWarp: true }
      },
      abcjsParams: {}
    });
  })
  watchDebounced([notation, state], n => {

    const nodes = document.querySelectorAll('[data-name]')
    nodes.forEach(node => {
      if (state.colorize) {
        const note = { pitch: 0, acc: 0, octave: 4 }
        const { name } = node.dataset
        if (name.length > 3 || /^\d+$/.test(name) || name == 'bar') return
        for (let i = 0; i < name.length; i++) {
          const pitch = notes.findIndex(note => note == name[i]?.toUpperCase())
          switch (name[i]) {
            case '^':
              note.acc++;
              break
            case '_':
              note.acc--;
              break
            case ',':
              note.octave--
              break
            default:
              const pitch = notes.findIndex(note => note == name[i]?.toUpperCase())
              if (pitch < 0) break
              if (name[i] == notes[pitch].toLowerCase()) note.octave++
              note.pitch = pitch
              node.dataset.pitch = pitch
              break
          }
        }

        const pitchClass = (note.pitch + note.acc + 12) % 12
        node.style.fill = noteColor(pitchClass, note.octave)
      } else {
        node.style.fill = 'currentColor'
      }


    })
  }, {
    immediate: true
  })
});
</script>

<template lang="pug">
.flex.flex-col.m-auto
  button(
    :style="{background: state.colorize ? 'linear-gradient(#e66465, #9198e5)': ''}" 
    class="button fixed right-16 bottom-4 z-20000 p-2 bg-light-400 dark-bg-dark-400 rounded-xl shadow active_bg-red-100" 
    @click="state.colorize = !state.colorize"
    ) Colorize notes
  svg-save.fixed.bottom-4.right-55(svg="paper" :deep="true")
  .flex.flex-wrap
    button.p-2.border-1.m-2(
      v-for="(tune, name) in tunes" :key="name"
      @click="notation = tune"
    ) {{ name }}
  textarea#abc.w-full.dark-bg-dark-800.p-4(
    v-model="notation"
    rows="18"
  )
  #warnings
  #audio.mt-6
  #paper
  
</template>

<style>
/* Some basic CSS to make the Audio controls in abcjs presentable. */

.abcjs-inline-audio {
  height: 42px;
  padding: 0 5px;
  border-radius: 3px;
  background-color: #424242;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.abcjs-inline-audio.abcjs-disabled {
  opacity: 0.5;
}

.abcjs-inline-audio .abcjs-btn {
  display: block;
  width: 28px;
  height: 34px;
  margin-right: 2px;
  padding: 7px 4px;

  background: none !important;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.abcjs-btn g {
  fill: #f4f4f4;
  stroke: #f4f4f4;
}

.abcjs-inline-audio .abcjs-btn:hover g {
  fill: #cccccc;
  stroke: #cccccc;
}

.abcjs-inline-audio .abcjs-midi-selection.abcjs-pushed {
  border: 1px solid #cccccc;
  background-color: #666666;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-loop.abcjs-pushed {
  border: 1px solid #cccccc;
  background-color: #666666;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-reset.abcjs-pushed {
  border: 1px solid #cccccc;
  background-color: #666666;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-start .abcjs-pause-svg {
  display: none;
}

.abcjs-inline-audio .abcjs-midi-start .abcjs-loading-svg {
  display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-pushed .abcjs-play-svg {
  display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-loading .abcjs-play-svg {
  display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-pushed .abcjs-pause-svg {
  display: block;
}

.abcjs-inline-audio .abcjs-midi-progress-background {
  background-color: #424242;
  height: 10px;
  border-radius: 5px;
  border: 2px solid #cccccc;
  margin: 0 8px 0 15px;
  position: relative;
  flex: 1;
  padding: 0;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-progress-indicator {
  width: 20px;
  margin-left: -10px;
  /* half of the width */
  height: 14px;
  background-color: #f4f4f4;
  position: absolute;
  display: inline-block;
  border-radius: 6px;
  top: -4px;
  left: 0;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-clock {
  margin-left: 4px;
  margin-top: 1px;
  margin-right: 2px;
  display: inline-block;
  font-family: sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  color: #f4f4f4;
}

.abcjs-inline-audio .abcjs-tempo-wrapper {
  font-size: 10px;
  color: #f4f4f4;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.abcjs-inline-audio .abcjs-midi-tempo {
  border-radius: 2px;
  border: none;
  margin: 0 2px 0 4px;
  width: 42px;
  padding-left: 2px;
  box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-loading .abcjs-loading-svg {
  display: inherit;
}

.abcjs-inline-audio .abcjs-loading {
  outline: none;
  animation-name: abcjs-spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.abcjs-inline-audio .abcjs-loading-svg circle {
  stroke: #f4f4f4;
}

@keyframes abcjs-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Adding the class "abcjs-large" will make the control easier on a touch device. */
.abcjs-large .abcjs-inline-audio {
  height: 52px;
}

.abcjs-large .abcjs-btn {
  width: 56px;
  height: 52px;
  font-size: 28px;
  padding: 6px 8px;
}

.abcjs-large .abcjs-midi-progress-background {
  height: 20px;
  border: 4px solid #cccccc;
}

.abcjs-large .abcjs-midi-progress-indicator {
  height: 28px;
  top: -8px;
  width: 40px;
}

.abcjs-large .abcjs-midi-clock {
  font-size: 32px;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: -1px;
}

.abcjs-large .abcjs-midi-tempo {
  font-size: 20px;
  width: 50px;
}

.abcjs-large .abcjs-tempo-wrapper {
  font-size: 20px;
}

.abcjs-css-warning {
  display: none;
}
</style>