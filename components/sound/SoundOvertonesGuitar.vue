<script setup>
import { computed, reactive } from 'vue';

defineProps({
  length: { type: Number, default: 0 }
});

const fretboard = reactive({
  semitone: 1.05946309436,
  inlays: computed(() => {
    return [3, 5, 7, 9, 15, 17, 19, 21].map(pos => {
      return 1 - Math.pow(0.9438743, pos - 0.5)
    })
  }),
  frets: computed(() => {
    let arr = []
    for (let i = 0; i < 22; i++) {
      arr.push(1 - Math.pow(0.9438743, i))
    }
    return arr
  })
});
</script>

<template lang="pug">
g#guitar
  path#body(
    d="M272.067496,477.021744 C152.799151,477.021744 64.2512517,431.596015 64.2512517,324.985083 C64.2512517,218.370585 135.631319,176.65559 135.631319,142.353147 C135.631319,108.052486 104.910874,46.8672837 128.402665,-6.90358408 C151.896237,-60.6708855 245.865182,-63.4525985 270.259887,-63.4525985 C294.654592,-63.4525985 388.625317,-60.6708855 412.117108,-6.90358408 C435.608899,46.8672837 404.888454,108.052486 404.888454,142.353147 C404.888454,176.65559 476.270303,218.370585 476.270303,324.985083 C476.270303,431.596015 391.337621,477.021744 272.067496,477.021744" 
    fill="gray" 
    opacity="0.1"
    transform="scale(0.24) rotate(-90) translate(-295, 380) "
    )
  path#head(
    d="M27.4,51.6c18.2-0.9,7.8,0.2,12.4,6.4c3.7,5,9.4-3.4,4.6-6.3c-1.3-0.8-1.3-0.9,5-1.1c6-0.2,5-0.6,4.9,1c-0.4,7.8,4.9,8.8,7,5.2c4-6.8-8.1-6.4,2.8-6.9c2.9-0.1,5.2-0.2,5.2-0.1c0.2,5.8,0.5,6.6,2.4,7.7c3.5,2.1,7.7-4,3.5-7.2	c-1.7-1.3-2.8-0.9,4.7-1.2c10-0.3,5.4-2.1,10.8-3.8c0.9-0.3,0.8-1.6,0.8-24.4c-8.4-4.5-2.5-4-15.8-4.3c-2.2-0.1-2.1,0.2-0.7-0.7	c3.8-2.4,1.6-8.6-2.3-7.9c-4.4,0.8-2.5,7.9-3.9,8.1c-0.6,0.1-10.5-0.2-9.1-0.8c4.2-1.8,2.2-9.1-2.2-8c-2.7,0.7-3.1,3-3.1,8.2	c-12-0.6-11.8-0.4-10.2-1.2c6.3-3.1-4.3-14.8-5.5-2.8c-0.4,4.1,1.4,3.3-11.6,2.6c-12-0.6-12-0.6-14.4,2.7C4.7,28.2,8.2,46,15,51.1	C16.4,52.1,16.5,52.1,27.4,51.6z M31.2,44.8c-0.4-1.5,0-2.4,1.1-3.1c0.5-0.3,5.7-0.8,6.2-0.5c0.2,0.1,0.2,2.2,0.1,5.7	C32.9,47.1,31.9,47.3,31.2,44.8z M42.6,41c0.1-0.2,11.7-0.8,11.7-0.6c-0.1,0.9,0.4,5.9-0.5,5.9c-0.1,0-10.7,0.6-11.1,0.4	C42.3,46.5,42.5,41.2,42.6,41z M58.3,43.1c0-3.8-0.4-3,6-3.3c6.5-0.3,5.2-1.2,5.1,2.8c-0.1,3.9,0.6,3-6.1,3.4	C57.6,46.3,58.3,46.8,58.3,43.1z M31.2,22.1c-0.6-5.1,7.4-3.2,7.4-3c0.1,0.4,0.1,5.5,0,5.5c0,0-1.3,0-2.9-0.1 	C32.5,24.3,31.4,23.8,31.2,22.1z M73.4,39.3c2.3,0,4.2-0.2,4.9,2.4c1,3.9-4.6,3.9-4.7,3.8C73.2,45.4,73.4,44.1,73.4,39.3z M42.5,19	c9.3,0.4,11.6,0.6,11.7,0.6c0.3,0.2,0.1,6-0.2,6c-0.2,0-2.7-0.2-5.6-0.3C41.6,24.9,42.4,26.1,42.5,19z M58.4,22.9	c0-1.6,0.1-2.9,0.1-3c0.1-0.2,10.5,0.1,10.9,0.3c0.2,0.1,0.1,3.3,0.1,6.1C56.2,25.7,58.4,26.9,58.4,22.9z M73.5,20.6	c0-0.5,2.4-0.1,3.6,0.6c1.8,1.1,1.9,3.6,0.2,4.7c-0.9,0.6-3.1,1-3.6,0.7C73.2,26.3,73.4,21.1,73.5,20.6z"
    transform="scale(0.52) translate(-91.5, -21.5)"
    fill="gray"
    opacity="0.3"
  )
  rect#fretboard(
    x="0"
    y="0"
    :width="length * 0.702"
    height="12"
    fill="gray"
    opacity="0.3"
    stroke="black"
    stroke-width="0.2"
  )
  line(
    :x1="length"
    :x2="length"
    y1="0"
    y2="12"
    stroke="gray"
    stroke-width="1"
  )
  circle(
    r="15"
    :cx="length * 0.8"
    cy="6"
    fill="hsla(0,0%,0%,0.1)"
  )
  circle(
    v-for="inlay in fretboard.inlays"
    :key="inlay"
    cy="6"
    r="1"
    :cx="inlay * length"
    opacity="0.5"
  )
  circle(
    cy="3"
    r="1"
    :cx="72.7"
    opacity="0.5"
  )
  circle(
    cy="9"
    r="1"
    :cx="72.7"
    opacity="0.5"
  )
  line(
    v-for="fret in fretboard.frets"
    :key="fret"
    :x1="fret * length"
    :x2="fret * length"
    y1="0"
    y2="12"
    stroke="currentColor"
    stroke-width="0.2"
  )
  line(
    v-for="string in 6"
    :key="string"
    :x1="0"
    :x2="length"
    :y1="string * 2 - 1"
    :y2="string * 2 - 1"
    stroke="gray"
    stroke-width="0.5"
    opacity="0.6"
  )
</template>

<style lang="postcss" scoped>

</style>