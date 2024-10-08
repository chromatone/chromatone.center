<script setup>
import { useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { reactive, ref, computed } from 'vue'
import { colord } from 'colord'
import { useGesture } from '@vueuse/gesture';


const mix = reactive({
  radius: 30,
  len: computed(() => mix.radius * Math.PI * 2),
  max: 100,
  c: useClamp(useStorage('cyan', 50), 0, 100),
  m: useClamp(useStorage('magenta', 50), 0, 100),
  y: useClamp(useStorage('yellow', 50), 0, 100),
  k: useClamp(useStorage('black', 10), 0, 100),
  cmyk: computed(() => `device-cmyk(${mix.c}% ${mix.m}% ${mix.y}% ${mix.k}% / 100%)`),
  hex: computed(() => colord(mix.cmyk).toHex())
});

function useDrag(channel) {
  return (delta) => {
    mix[channel] = Number(mix[channel]) + (Number(delta[0]) - Number(delta[1]))
  }
}

const controlC = ref()
const controlM = ref()
const controlY = ref()
const controlK = ref()

const controls = {
  c: controlC,
  m: controlM,
  y: controlY,
  k: controlK
}

for (let control in controls) {
  useGesture({
    onDrag(ev) {
      ev?.event?.preventDefault()
      useDrag(control)(ev.delta)
    },
    onWheel(ev) {
      ev?.event?.preventDefault()
      useDrag(control)(ev.velocities.map(v => -v))
    }
  }, {
    domTarget: controls[control],
    eventOptions: { passive: false }
  })
}


</script>

<template lang="pug">
.fullscreen-container.p-4.transition-all.duration-800.ease-out.w-full#screen(:style="{ backgroundColor: mix.hex }")
  svg.min-h-80svh.max-h-100svh.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    text-anchor="middle"
    font-family="Commissioner, sans-serif"
    style="touch-action: none;"
    )
    circle#white(
      fill="white"
      r="50"
      cx=50
      cy=50
    )
    g#sources
      circle(
        r=8
        cx=50
        cy=10
        fill="cyan"
        )
      circle(
        r=8
        cx=85
        cy=70
        fill="magenta"
        )
      circle(
        r=8
        cx=15
        cy=70
        fill="yellow"
        )
      circle(
        r=4
        cx=50
        cy=65
        fill="black"
        )
    g#circles.cursor-pointer(

      stroke-linecap="round"
    )
      circle#c.mix-blend-multiply.cursor-pointer(
        :r="mix.radius"
        ref="controlC"
        stroke="cyan"
        :stroke-dashoffset="mix.len - mix.len * (mix.c / mix.max)"
        :stroke-dasharray="mix.len"
        transform="translate(50,33) rotate(-90)"
        :fill="`hsla(180,100%,50%,${mix.c / 100})`"
      )
      circle#m.mix-blend-multiply.cursor-pointer(
        :r="mix.radius"
        ref="controlM"
        stroke="magenta"
        :stroke-dashoffset="mix.len - mix.len * (mix.m / mix.max)"
        :stroke-dasharray="mix.len"
        transform="translate(65,58) rotate(30)"
        :fill="`hsla(300,100%,50%,${mix.m / 100})`"
      )
      circle#y.mix-blend-multiply.cursor-pointer(
        :r="mix.radius"
        ref="controlY"
        stroke="yellow"
        :stroke-dashoffset="mix.len - mix.len * (mix.y / mix.max)"
        :stroke-dasharray="mix.len"
        transform="translate(35,58) rotate(150)"
        :fill="`hsla(60,100%,50%,${mix.y / 100})`"
      )
      circle#k.mix-blend-multiply(
        ref="controlK"
        r="18"
        stroke="black"
        transform="translate(50,50) rotate(90)"
        :stroke-dashoffset="18 * Math.PI * 2 * (1 - (mix.k / mix.max))"
        :stroke-dasharray="18 * Math.PI * 2"
        :fill="`hsla(60,0%,0%,${mix.k / 100})`"
      )
    g#labels.font-bold.text-xs.pointer-events-none.select-none(fill="white")
      text(
        x="49.5"
        y="14"
      ) C
      text(
        x="15"
        y="74"
      ) Y
      text(
        x="85"
        y="74"
      ) M
      text.text-4px(
        x="50"
        y="66.5"
      ) K

    color-svg-info.select-none(
      :y="42" 
      transform="scale(0.8) translate(12,4)"
      :color="{ c: mix.c, m: mix.m, y: mix.y, k: mix.k, a: 1 }"
      )
  //- .flex.flex-col.items-center 
  //- .flex.flex-wrap.justify-center
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="cyan" style="color:cyan") CYAN {{ mix.c }}
  //-     input(type="range" v-model="mix.c" min="0" max="100" id="cyan")
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="magenta" style="color:magenta") MAGENTA {{ mix.m }}
  //-     input(type="range" v-model="mix.m" min="0" max="100" id="magenta")
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="yellow" style="color:yellow") YELLOW {{ mix.y }}
  //-     input(type="range" v-model="mix.y" min="0" max="100" id="yellow")
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="black" style="color:black") BLACK {{ mix.k }}
  //-     input(type="range" v-model="mix.k" min="0" max="100" id="black")
</template>

<style lang="postcss" scoped></style>