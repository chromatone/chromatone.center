<script setup>
import { rotateArray, getCircleCoord } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { colord } from 'colord'
import { chromaColorMix } from "#/use/colors";
import { globalScale } from '#/use/chroma'
import { pitchFreq } from '#/use/calculations'
import { computed, ref } from 'vue';
import { notes } from '#/use/theory';

const pressed = ref(false);

const octaves = ref(4)


</script>

<template lang="pug">
svg.select-none(
  version="1.1",
  baseProfile="full",
  viewBox="-10 -10 20 20",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
  )
  g.octaves
    g.octave(v-for="(octave,oct) in octaves" :key="octave")
      circle(
        cx="0"
        cy="0"
        :r="10 - oct*(10/octaves)"
        opacity="0.5"
        fill="red"
        )


  //- g(v-for="(note, n) in actualChroma" :key="n")
  //-   line(
  //-     :x1="getCircleCoord(n, 12, 6.5, 0).x"
  //-     :y1="getCircleCoord(n, 12, 6.5, 0).y"
  //-     x2="0"
  //-     y2="0"
  //-     v-if="note == '1'"
  //-     stroke-linecap="square"
  //-     stroke-width="3.92"
  //-     :stroke="note == '1' ? colord(noteColor(n, 3)).toHex() : 'none'"
  //-     )
  //- g.cursor-pointer(
  //-   v-for="(note, n) in actualChroma" :key="n"
  //-   :transform="`translate(${getCircleCoord(n, 12, 8, 0).x}, ${getCircleCoord(n, 12, 8, 0).y})`"
  //-   @mousedown="toggleNote(n)"
  //- )
  //-   circle(
  //-     x="0" 
  //-     y="0" 
  //-     :r="note == '1' ? 2 : 1"
  //-     :fill="colord(note == '1' ? noteColor(n) : notes[n].length != 2 ? 'hsl(0,0%,85%)' : 'hsl(0,0%,60%)').toHex()"
  //-   )
  //-   text(
  //-     v-if="note == '1'"
  //-     y="0.3"
  //-     font-size="2px"
  //-     font-weight="bold"
  //-     :fill="colord(noteColor(n)).isDark() ? 'white' : 'black'"
  //-     ) {{ notes[n] }}
  //- g.center.cursor-pointer()
  //-   circle(
  //-     cx="0"
  //-     cy="0"
  //-     r="5"
  //-     :fill="pitch === false ? 'none' : noteColor(actualPitch, 3)"
  //-     )
  //-   text(
  //-     y="0.3"
  //-     font-size="2px"
  //-     font-weight="bold"
  //-     :fill="colord(noteColor(actualPitch)).isDark() ? 'white' : 'black'"
  //-     ) {{ pitch === false ? '' : typeof pitch == 'string' ? pitch : notes[actualPitch] }}{{ chord.aliases[0] }}
  //-   text(
  //-     y="3"
  //-     font-size="1.8px"
  //-     font-weight="normal"
  //-     :fill="colord(noteColor(actualPitch)).isDark() ? 'white' : 'black'"
  //-     ) {{ type }}
</template>

<style lang="postcss" scoped>
.center {
  @apply transition-all duration-200 ease-in-out;
}

.center:hover {
  @apply transform scale-105;
}

.center.pressed {
  @apply transform scale-100;
  filter: brightness(1.1);
}
</style>