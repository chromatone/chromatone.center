<script setup>
import { computed, reactive, ref, watch } from "vue"
import { useClamp } from "@vueuse/math"
import { useSpring } from "vue-use-spring"
import { Frequency } from "tone"
import Fraction from "fraction.js"

import { useString } from "#/use"
import { freqColor } from "#/use/calculations"
import fractions from "./fractions"

const started = ref(false)

const state = reactive({
  ratio: useClamp(0.66, 0.05, 0.95),
  fraction: computed(() => simple(state.ratio)),
  invFraction: computed(() => simple(1 - state.ratio)),
})

const simple = (ratio) => new Fraction(ratio).simplify(0.001).toFraction(true)

const smooth = useSpring({ ratio: state.ratio })
watch(() => state.ratio, r => smooth.ratio = r)

const frequencies = reactive([
  useClamp(220, 27.5, 3520),
  computed(() => frequencies[0].value / (smooth.ratio)),
  computed(() => frequencies[0].value / (1 - smooth.ratio)),
])

const stringNames = ['fundamental', 'left', 'right']

const stringList = reactive(stringNames.map((s, i) => {
  const name = computed(() => Frequency(frequencies[i].value).toNote())
  const cents = computed(() => calcCents(Frequency(name.value).toFrequency(), frequencies[i].value))
  return { ...useString(s), name, cents }
}))

const calcCents = (base, freq) => (-(1200 / Math.log10(2)) * Math.log10(base / freq)) % 1200

function start() {
  if (started.value) return
  stringList.forEach(s => s.init())
  started.value = true
}

const toMIDI = (freq) => 69 + 12 * Math.log2(freq / 440)

function play(string = 0, vel = 0.5) {
  if (!started.value) return
  Object.assign(stringList[string].note, {
    number: toMIDI(frequencies[string].value).toFixed(4),
    velocity: vel,
  })
}

function changeFrequency(drag) {
  frequencies[0].value += drag.wheeling ? -drag.delta[0] / 32 : drag.delta[0] / 4
}

function changeRatio(drag) {
  state.ratio += drag.wheeling ? -drag.delta[0] / 4800 : drag.delta[0] / 1200
}
</script>

<template lang="pug">
.flex.flex-col.fullscreen-container.select-none#screen.z-100
  button.min-h-80vh.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700.absolute.min-h-30.top-0.z-100.right-0.left-0.w-full.bg-op-30.dark-bg-op-30.backdrop-blur(v-if="!started" @pointerdown="start()") START 
  svg.my-12.select-none.touch-action-none.select-none(
    v-else
    style="-webkit-overflow-scrolling: touch;"
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -5 120 31`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    font-size="3px"
    text-anchor="middle",
    dominant-baseline="middle"
    stroke-linecap="round"
    fill="white"
    )

    g#ratio.cursor-pointer(
      transform="translate(0 10)"
      font-size="4px" 
      stroke-width="0"
      fill="currentColor" )

      g#intervalL.touch-manipulation(
        @pointerdown="play(0); play(1)"
        @pointercancel="play(0, 0); play(1, 0)"
        @pointerup="play(0, 0); play(1, 0)"
        @pointerout="play(0, 0); play(1, 0)"
        )
        defs
          linearGradient#intL
            stop(offset="0%" :style="{ stopColor: freqColor(frequencies[1].value, undefined, stringList[1].meter) }")
            stop(offset="100%" :style="{ stopColor: freqColor(frequencies[0].value, undefined, stringList[0].meter) }")
        rect(:width="100 * smooth.ratio - 4" height="8" y="-4" x="1" rx="2" fill="url(#intL)")
        text.pointer-events-none(:x="100 * smooth.ratio / 2 - 2" text-anchor="middle" y=".5") 
          tspan.font-bold(:fill="freqColor(frequencies[1].value)") {{ state.fraction.split('/')[0] }}
          tspan /
          tspan.font-bold(:fill="freqColor(frequencies[0].value)") {{ state.fraction.split('/')[1] }}

      g#intervalR.touch-manipulation(
        @pointerdown="play(0); play(2)"
        @pointercancel="play(0, 0); play(2, 0)"
        @pointerup="play(0, 0); play(2, 0)"
        @pointerout="play(0, 0); play(2, 0)"
        )
        defs
          linearGradient#intR
            stop(offset="0%" :style="{ stopColor: freqColor(frequencies[0].value, undefined, stringList[0].meter) }")
            stop(offset="100%" :style="{ stopColor: freqColor(frequencies[2].value, undefined, stringList[2].meter) }")
        rect(:width="100 * (1 - smooth.ratio) - 4" height="8" y="-4" :x="100 - 100 * (1 - smooth.ratio) + 3" rx="2" fill="url(#intR)")
        text.pointer-events-none(:x="100 * smooth.ratio + 100 * (1 - smooth.ratio) / 2 + 2" text-anchor="middle" y=".5") 
          tspan.font-bold(:fill="freqColor(frequencies[2].value)") {{ state.invFraction.split('/')[0] }}
          tspan /
          tspan.font-bold(:fill="freqColor(frequencies[0].value)") {{ state.invFraction.split('/')[1] }}

    g#fundamental.cursor-pointer.touch-manipulation(
      v-drag="changeFrequency" 
      v-wheel="changeFrequency"
      @pointerdown="play(0)"
      @pointercancel="play(0, 0)"
      @pointerleave="play(0, 0)"
      @pointerout="play(0, 0)"
      @pointerup="play(0, 0)"
      )
      line(
        x2="100", 
        stroke-width="10", 
        :stroke="freqColor(frequencies[0].value, 0.3 + 0.7 * stringList[0].meter)")
      circle(r="2")
      circle(cx="100", r="2")
      text.pointer-events-none(x="50" y=".5" font-weight="bold" text-anchor="end") 
        tspan.text-6px  {{ stringList[0].name }}
      text.pointer-events-none(x="50.5" y="-1.5" text-anchor="start")
        tspan.text-2px {{ stringList[0].cents > 0 ? '+' : '' }}{{ stringList[0].cents.toFixed() }}% 
        tspan.text-2px(x="50.75" y="1.5") {{ frequencies[0].value.toFixed(2) }} Hz 

    g#divided.cursor-pointer.touch-manipulation(
      v-drag="changeRatio" 
      v-wheel="changeRatio"
      transform="translate(0,20)")

      g#right(
        @pointerdown="play(2)"
        @pointercancel="play(2, 0)"
        @pointerleave="play(2, 0)"
        @pointerout="play(2, 0)"
        @pointerup="play(2, 0)"
        )
        line( 
          :stroke="freqColor(frequencies[2].value, 0.3 + 0.7 * stringList[2].meter)" 
          stroke-width="10",
          :x1="100 * smooth.ratio"
          x2="100"
          )
        circle(r="2" cx="100")
        g(:transform="`translate(${100 * smooth.ratio + 5 + 100 * (1 - smooth.ratio) / 2} 0.5)`")
          text.text-6px(y="0.3", x="-1" font-weight="bold" text-anchor="end")  {{ stringList[2].name }} 
          text.text-2px( y="-1.5" text-anchor="start") {{ stringList[2].cents > 0 ? '+' : '' }}{{ stringList[2].cents.toFixed() }}% 
          text.text-2px( y="1.5" text-anchor="start") {{ frequencies[2].value.toFixed(2) }} Hz 

      g#left(
        @pointerdown="play(1)"
        @pointercancel="play(1, 0)"
        @pointerleave="play(1, 0)"
        @pointerout="play(1, 0)"
        @pointerup="play(1, 0)"
        )
        line( 
          :stroke="freqColor(frequencies[1].value, 0.3 + 0.7 * stringList[1].meter)" 
          stroke-width="10",
          :x2="100 * smooth.ratio"
        )
        circle(r="2")
        circle(:cx="100 * smooth.ratio" r="2")
        g(:transform="`translate(${100 * smooth.ratio / 2} 0.5)`")
          text.text-6px(y="0.3", x="-1" font-weight="bold" text-anchor="end")  {{ stringList[1].name }} 
          text.text-2px( y="-1.5" text-anchor="start") {{ stringList[1].cents > 0 ? '+' : '' }}{{ stringList[1].cents.toFixed() }}% 
          text.text-2px( y="1.5" text-anchor="start") {{ frequencies[1].value.toFixed(2) }} Hz 

    g#ruler.touch-manipulation(stroke-width="0.2" stroke="currentColor"  )
      line(y1="0" y2="20")
      line(x1="100" x2="100" y1="0" y2="20")
      line(:x1="100 * smooth.ratio" :x2="100 * smooth.ratio" y1="5" y2="20")
      rect.cursor-grab(width="8" height="8" opacity="0.3" rx="2" :x="100 * smooth.ratio - 4" y="6" v-wheel="changeRatio" v-drag="changeRatio" )

  .flex.flex-wrap.justify-center.p-2
    button.text-button.flex-1(
      :class="{ active: fName == state.fraction }"
      v-for="(frac, fName) in fractions" 
      :key="fName"
      @click="state.ratio = frac" ) {{ fName }}
</template>
