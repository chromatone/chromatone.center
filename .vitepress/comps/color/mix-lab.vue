<template lang="pug">
.fullscreen-container.mb-8.p-4.rounded-2xl.transition-all.duration-800.ease-out(ref="screen" :style="{ backgroundColor: mix.hex }")
  full-screen.absolute.top-2.right-2(:el="screen")
  svg.max-h-3xl.w-full.select-none(
    version="1.1",
    baseProfile="full",
    viewBox="-20 -20 140 130",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    style="touch-action: pinch-zoom; user-select:none"
    )
    defs
      linearGradient#gray(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step,i) in 10" :key="step"
          :stop-color="colord({ l: 100 - 10 * i, a: mix.a, b: mix.b, alpha: 1 }).toHex()" :offset="i * 10 + '%'"
          )
      linearGradient#green-red(x1="0" x2="1" y1="0" y2="0")
        stop(
          v-for="(step,i) in 10" :key="step"
          :stop-color="colord({ l: mix.l, a: i * mix.range / 10 - mix.range / 2, b: mix.b, alpha: 1 }).toHex()" :offset="i * 10 + '%'"
          )
      linearGradient#blue-yellow(x1="0" x2="0" y1="0" y2="1")
        stop(
          v-for="(step,i) in 10" :key="step"
          :stop-color="colord({ l: mix.l, a: mix.a, b: (10 - i) * mix.range / 10 - mix.range / 2, alpha: 1 }).toHex()" :offset="i * 10 + '%'"
          )
    g#square
      g(
        v-for="(a,an) in mix.steps.a" :key="a + an"
      )
        rect.cursor-pointer.transition-all.duration-400.ease-in-out(
          v-for="(b,bn) in mix.steps.b" :key="b + bn"
          :x="an * mix.width / (mix.res)"
          :y="bn * mix.height / (mix.res)"
          :rx="mix.current == getHex(mix.l, a, b) ? 10 : 0"
          :class="{ current: mix.current == getHex(mix.l, a, b) }"
          :width="mix.width / (mix.res)"
          :height="mix.height / (mix.res)"
          @click="selectColor(mix.l, a, b)"
          :fill="getHex(mix.l, a, b)"
          :stroke="getHex(mix.l, a, b)"
          stroke-width="0.1px"
        )
    g#b-range.cursor-pointer
      rect#b(
        x="-15"
        y="0"
        width="10"
        height="100"
        fill="url(#blue-yellow)"
        v-drag="onDragB"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 * (-mix.b + mix.range / 2) / (mix.range)})`"
      )
        line(
          x1="-15"
          x2="-5"
          stroke="currentColor"
          stroke-linecap="round"
        )
        line.mix-blend-difference(
          x1="-15"
          x2="100"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="0.1px"
        )
        text(
          fill="currentColor"
          font-size="3px"
          x="-10"
          y="-4"
          font-weight="bold"
        ) B {{ mix.b.toFixed(1) }}
    g#l-range.cursor-pointer
      rect#l(
        x="105"
        y="0"
        width="10"
        height="100"
        fill="url(#gray)"
        v-drag="onDragL"
      )
      g.pointer-events-none(
        :transform="`translate(0,${100 - mix.l})`"
      )
        line.mix-blend-difference(
          x1="105"
          x2="115"
          stroke="currentColor"
          stroke-linecap="round"
        )
        text(
          fill="currentColor"
          font-size="3px"
          x="110"
          y="-3"
          font-weight="bold"
        ) L {{ mix.l.toFixed(1) }}
    g#a-range.cursor-pointer
      rect#a(
        x="0"
        y="-15"
        width="100"
        height="10"
        fill="url(#green-red)"
        v-drag="onDragA"
      )
      g.pointer-events-none(
        :transform="`translate(${100 * (mix.a + mix.range / 2) / (mix.range)},0)`"
      )
        line.mix-blend-difference(
          y1="-15"
          y2="-5"
          stroke="currentColor"
          stroke-linecap="round"
        )
        line(
          y1="-15"
          y2="100"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="0.1px"
        )
        text(
          fill="currentColor"
          font-size="3px"
          x="7"
          y="-9.5"
          font-weight="bold"
        ) A {{ mix.a.toFixed(1) }}
    g#res.cursor-pointer(
      :transform="`translate(20, 105)`"
      font-size="2"
      v-drag="onDragRes"
    )
      rect(
        x="-20" y="-2.5" 
        width="40" height="4" 
        fill="#ccc" stroke="currentColor"
        stroke-width="0.2")
      rect( 
        x="-20" y="-2.5" 
        :width="40 * (mix.res / 36)" height="4" 
        fill="#aaa" stroke="currentColor"
        stroke-width="0.2")
      text.uppercase RESOLUTION {{ mix.res }}x{{ mix.res }} 
    g#range.cursor-pointer(
      :transform="`translate(80, 105)`"
      font-size="2"
      v-drag="onDragRange"
    )
      rect(
        x="-20" y="-2.5" 
        width="40" height="4" 
        fill="#ccc" stroke="currentColor"
        stroke-width="0.2")
      rect( 
        x="-20" y="-2.5" 
        :width="40 * (mix.range / 300)" height="4" 
        fill="#aaa" stroke="currentColor"
        stroke-width="0.2")
      text.uppercase AB RANGE {{ mix.range }}
    transition(name="fade")
      g#current.cursor-pointer(
        v-drag="onDrag"
      )
        rect.transition-all.duration-400.ease-in-out(
          :x="30"
          :y="30"
          :width="40"
          :height="40"
          :fill="mix.hex"
        )
        color-svg-info(:color="mix.lab" :y="40")
</template>

<script setup>
import { colord } from 'colord'

const screen = ref()

const mix = reactive({
  current: useStorage('color-current', '#fffff'),
  max: {
    l: 100,
    res: 36,
  },
  l: useStorage('color-l', 50),
  a: useStorage('color-a', 20),
  b: useStorage('color-b', 20),
  range: useStorage('lab-range', 100),
  lab: computed(() => {
    return { l: mix.l, a: mix.a, b: mix.b, alpha: 1 }
  }),
  hex: computed(() => colord(mix.lab).toHex()),
  width: 100,
  height: 100,
  res: useStorage('lab-res', 10),
  steps: {
    a: computed(() => getSteps(mix.res)),
    b: computed(() => getSteps(mix.res))
  },
});

function getHex(l, a, b) {
  return colord({ l: l, a: a * mix.range, b: -b * mix.range, alpha: 1 }).toHex()
}

function getSteps(count) {
  return [...Array(count)].map((_, i) => (i - count / 2) / count)
}

function onDrag(drag) {
  mix.b = clampNum(mix.b, -drag.delta[1] / 2, -mix.range / 2, mix.range / 2)
  mix.a = clampNum(mix.a, drag.delta[0] / 2, -mix.range / 2, mix.range / 2)
}

function onDragRes(drag) {
  mix.res = clampNum(mix.res, drag.delta[0], 4, 36)
}

function onDragRange(drag) {
  mix.range = clampNum(mix.range, drag.delta[0], 100, 300)
}

function onDragL(drag) {
  mix.l = clampNum(mix.l, -drag.delta[1] / 8)
}

function onDragA(drag) {
  mix.a = clampNum(mix.a, drag.delta[0] / 2, -mix.range / 2, mix.range / 2)
}

function onDragB(drag) {
  mix.b = clampNum(mix.b, -drag.delta[1] / 2, -mix.range / 2, mix.range / 2)
}

function clampNum(main, delta, min = 0, max = 100) {
  let num = Number(main) + Number(delta)
  if (num < min) {
    num = min
  }
  if (num > max) {
    num = max
  }
  return num
}

function selectColor(l, a, b) {
  mix.a = a * mix.range
  mix.b = -b * mix.range
  mix.current = mix.hex
}

watchEffect(() => {
  mix.current = mix.hex
});

</script>

<style scoped>
</style>