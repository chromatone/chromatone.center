<script setup lang="ts">
import { noteColor } from "../../use/colors"
import { notes } from '../../use/theory'
import { onMounted, watchEffect } from "vue";
import { state } from './state'

const props = defineProps({
  abc: {
    type: String,
    default: 'ABCD'
  },
  staffwidth: {
    type: Number,
    default: 300,
  },
  responsive: {
    type: Boolean,
    default: false
  },
  save: {
    type: Boolean,
    default: false
  }
})

const id = (Math.random() + 1).toString(36).substring(7)

onMounted(() => {
  import('abcjs').then(ABCJS => {
    watchEffect(() => {

      let visualObj = ABCJS.renderAbc(id, props.abc, {
        responsive: props.responsive ? 'resize' : null,
        scale: 3,
        add_classes: true,
        paddingbottom: 10,
        paddingtop: 0,
        staffwidth: 300,
        clickListener,
      })
      if (!state.colorize) return
      const nodes = document.querySelectorAll('[data-name]')
      nodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return
        const note = { pitch: 0, acc: 0, octave: 4 }
        const { name } = node.dataset
        if (name.length > 3 || /^\d+$/.test(name) || name == 'bar') return
        for (let i = 0; i < name.length; i++) {
          const pitch = notes.findIndex(note => note == name[i]?.toUpperCase())
          // console.log(pitch)
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
              note.pitch = pitch
              node.dataset.pitch = String(pitch)
              break
          }
        }

        const pitchClass = (note.pitch + note.acc + 12) % 12
        node.style.fill = noteColor(pitchClass, note.octave)

      })


    })
  })
});

function clickListener(elem, tune, classes, analysis, drag) {
  // console.log({ elem, analysis })
  console.log(analysis?.clickedName, analysis)
}
</script>

<template lang="pug">
.flex
  .abc-render(:id="id") {{ abc }}
  save-svg(:svg="id" v-if="save")
</template>
 
<style lang="postcss" scoped>
.abc-render {
  @apply pb-70;
}
</style>

