<template lang="pug">
.flex.flex-col.mb-8
  .flex.flex-wrap.justify-center
    sqnob(v-model="mix.res" :min="2" :max="mix.max.res" :param="`resolution`" :fixed="0")
    sqnob(v-model="mix.range" :min="60" :max="300" :param="`range`" :fixed="0")
  svg.max-h-3xl.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="-20 -20 140 120",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    font-family="Commissioner, sans-serif"
    style="touch-action: pinch-zoom;"
    )
    defs
      linearGradient#gray(x1="0" x2="0" y1="0" y2="1")
        stop(stop-color="white" offset="0%")
        stop(stop-color="black" offset="100%")
      linearGradient#green-red(x1="0" x2="1" y1="0" y2="0")
        stop(:stop-color="colord({ l: mix.l, a: -mix.range, b: 0, alpha: 1 }).toHex()" offset="0%")
        stop(:stop-color="colord({ l: mix.l, a: mix.range, b: 0, alpha: 1 }).toHex()" offset="100%")
      linearGradient#blue-yellow(x1="0" x2="0" y1="0" y2="1")
        stop(:stop-color="colord({ l: mix.l, a: 0, b: mix.range, alpha: 1 }).toHex()" offset="0%")
        stop(:stop-color="colord({ l: mix.l, a: 0, b: -mix.range, alpha: 1 }).toHex()" offset="100%")
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
        line.mix-blend-difference(
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
          font-size="3px"
          x="-14"
          y="-2"
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
          font-size="3px"
          x="106"
          y="-2"
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
        line.mix-blend-difference(
          y1="-15"
          y2="100"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="0.1px"
        )
        text(
          font-size="3px"
          x="1"
          y="-2"
        ) A {{ mix.a.toFixed(1) }}
    transition(name="fade")
      g#current.cursor-pointer(
        @click="mix.current = null"
        v-if="mix.current"
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
const mix = reactive({
  current: useStorage('color-current', '#fffff'),
  max: {
    l: 100,
    res: 50,
  },
  l: useStorage('color-l', 50),
  a: useStorage('color-a', 20),
  b: useStorage('color-b', 20),
  range: useStorage('lab-max', 300),
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
.current {
}
</style>