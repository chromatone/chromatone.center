
<script setup>
const props = defineProps({
  list: Object,
  langs: Object,
});

const cards = Object.values(props.list)

const positions = [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1],];

import { pitchColor } from '@use/calculations'
import { notes } from '@use/theory'
import { colord } from 'colord'
</script>

<template lang="pug">
.flex.flex-col.relative
  .absolute
    slot
  svg.w-full(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 400 400`",
    xmlns="http://www.w3.org/2000/svg",
    style="touch-action:none"
    )
    defs
      filter#shadowButton(x="-50%" height="200%" width="300%")
        feDropShadow(dx="0" dy="1" stdDeviation="2" flood-color="#2225")
    g.card(

      v-for="(pos, p) in positions" :key="pos"
      :transform="`translate(${pos[0] * 100} ${pos[1] * 100})`"
    )
      rect(
        class="opacity-60 hover_(opacity-100) transition-all duration-200 ease"
        style="filter:url(#shadowButton)"
        x="1"
        y="1"
        width="98"
        height="98"
        rx="12"
        :fill="pitchColor(p, 3)"
      )
      g.text.pointer-events-none(
        transform="translate(10 22)"
        fill="currentColor"
      )
        text.font-bold.text-12px {{ cards[p].en }}
        text.font-bold.text-14px(transform="translate(80 65)" text-anchor="end") {{ notes[p] }}
        g.other(
          v-for="(lang, l, i) in langs" :key="lang"
          :transform="`translate(0 ${i * 12 + 16})`"
        )
          text(v-if="l != 'nm'")
            tspan.text-8px() {{ cards[p][l] }}
            tspan.text-6px(dx="2" fill="#000a" text-anchor="end") {{ l }}
        g.code.text-8px(
          transform="translate(80 -2)"
          text-anchor="end"
        )
          text {{ p * 30 }}&deg;
          text(y="10") {{ cards[p].nm }}
          text(y="22") {{ colord(pitchColor(p, 3)).toHex() }}
    //- g.center
    //-   color-cards-circles(
    //-   transform="rotate(-45) scale(0.4)"
    //-   transform-origin="center center"
    //- )  
</template>