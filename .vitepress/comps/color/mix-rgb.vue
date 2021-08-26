<template lang="pug">
.flex.flex-col.items-center.mb-8.p-4
  svg.max-h-90vh.w-full(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
    stroke-width="2px"
    style="touch-action: pinch-zoom;"
    )
    circle#black(
      r="50"
      cx=50
      cy=50
    )
    g#sources
      circle(
        r=8
        cx=15
        cy=29
        fill="#ff0000"
        )
      circle(
        r=8
        cx=85.5
        cy=29
        fill="#00ff00"
        )
      circle(
        r=8
        cx=50
        cy=91
        fill="#0000ff"
        )
    g#circles.cursor-pointer(
      v-drag="onDrag"
      stroke-linecap="round"
      :stroke-dasharray="mix.len"
    )
      circle#r.mix-blend-lighten(
        :r="mix.radius"
        :fill="`rgb(${mix.r},0,0)`"
        stroke="#ff0000"
        :stroke-dashoffset="mix.len - mix.len * (mix.r / mix.max)"
        transform="translate(35,40) rotate(-150)"
      )

      circle#g.mix-blend-lighten(
        :r="mix.radius"
        :fill="`rgb(0,${mix.g},0)`"
        stroke="#00ff00"
        :stroke-dashoffset="mix.len - mix.len * (mix.g / mix.max)"
        transform="translate(65,40) rotate(-30)"
      )
      circle#b.mix-blend-lighten(
        :r="mix.radius"
        :fill="`rgb(0,0,${mix.b})`"
        stroke="#0000ff"
        :stroke-dashoffset="mix.len - mix.len * (mix.b / mix.max)"
        transform="translate(50,68) rotate(90)"
      )
    g#text.font-bold.text-xs.pointer-events-none.select-none
      text(
        x="15"
        y="33"
        text-anchor="middle"
        fill="white"
      ) R
      text(
        x="50"
        y="95"
        text-anchor="middle"
        fill="white"
      ) B
      text(
        x="85"
        y="33"
        text-anchor="middle"
        fill="white"
      ) G
      color-svg-info(:color="mix.rgb" :y="42")
  //- .flex.flex-wrap.justify-center
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="red" style="color:#FF0000") RED {{ mix.r }}
  //-     input(type="range" v-model="mix.r" min="0" max="255" id="red")
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="green" style="color:#00FF00") GREEN {{ mix.g }}
  //-     input(type="range" v-model="mix.g" min="0" max="255" id="green")
  //-   .flex.flex-col.items-center.p-2
  //-     label(for="blue" style="color:#0000FF") BLUE {{ mix.b }}
  //-     input(type="range" v-model="mix.b" min="0" max="255" id="blue")
</template>

<script setup>
const mix = reactive({
  radius: 30,
  len: computed(() => mix.radius * Math.PI * 2),
  max: 255,
  r: useStorage('red', 190),
  g: useStorage('gree', 190),
  b: useStorage('blue', 190),
  rgb: computed(() => `rgb(${mix.r},${mix.g},${mix.b})`)
});

function onDrag(drag) {
  let id = drag.event.target.id
  mix[id] = Number(mix[id]) + (Number(drag.delta[0]) - Number(drag.delta[1]))
  if (mix[id] < 0) {
    mix[id] = 0
  }
  if (mix[id] > mix.max) {
    mix[id] = mix.max
  }
}
</script>

<style scoped>
</style>