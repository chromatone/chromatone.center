<script setup>
import { useSequence } from '@use/sequence.js'
import { isDark } from '@theme/composables/state.js'
import { tempo } from '@use/tempo'
import { pitchColor, rotateArray } from '@use/calculations'
import { levelColor } from '@use/colors'

const width = 920
const pad = (1000 - width) / 2

const emit = defineEmits(['del', 'sound']);

const props = defineProps({
  order: { type: Number, default: 0 },
  loop: { type: Object, default: { over: 4, under: 4, sound: 'A', volume: 1, } },
  maxRatio: { type: Number, default: 1 },
  editable: { type: Boolean, default: false, },
  mute: { type: String, default: null, },
  accent: { type: String, default: null }
});

const sounds = ['A', 'B', 'C', 'D', 'E']
const soundControl = ref(sounds.findIndex(el => el == props.loop?.sound))
watch(soundControl, num => {
  emit('sound', sounds[num])
})

const { progress, current, steps, mutes, accents, volume, panning } = useSequence(props.loop, props.order, 'bars');

const proportion = computed(() => ((props.loop.over / props.loop.under) / props.maxRatio) / props.loop.over)

const activeSteps = computed(() => {
  return steps.filter(step => !mutes.value[step[0].split('-')[0]]).map(step => Number(step[0].split('-')[0]))
})

function rotateAccents(num) {
  accents.value = rotateArray(accents.value, num)
  mutes.value = rotateArray(mutes.value, num)
}

function dragVol(drag) {
  volume.value += drag.delta[0] / 100
}

watch(() => props.accent, accent => {
  if (accent) {
    accent.split('').forEach((sign, m) => {
      mutes.value[m] = (sign == 0 || sign == '.')
      accents.value[m] = (sign == 2 || sign == 'X')
    })
  }
}, { immediate: true });

</script>


<template lang="pug">
svg.w-full(
  class="bg-light-300 dark_bg-dark-800"
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 1000 350`",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )
  defs
    filter#shadowButton(x="-50%" height="200%" width="300%")
      feDropShadow(dx="0" dy="3" stdDeviation="3" flood-color="#2225")
  g.meter-bars(
    v-if="editable"
    transform="translate(40,15)"
  )
    beat-control-bar.over(
      v-model="loop.over"
      :width="340"
      :step="1"
      :min="2"
      :max="16"
      show-positions
      :ratio="500"
      :every="4"
    )
    beat-control-bar.under(
      transform="translate(580,0)"
      v-model="loop.under"
      :width="340"
      :step="1"
      :min="1"
      :max="16"
      show-positions
      :ratio="500"
      :every="4"
      inverted
      :vector="[-1, -1]"
    )

  g.info(
    :transform="`translate(500,53)`"
  )
    text(
      fill="currentColor"
      font-size="45"
      text-anchor="middle",
      y="2"
    ) /
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="end",
      :x="-10",
      ) {{ loop.over }} 
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="start",
      :x="10",
      ) {{ loop.under }} 
    g.cursor-pointer.opacity-50.transition-all.duration-200.ease(
      class="hover_opacity-100"
      transform="translate(70,-10)"
      @mousedown="rotateAccents(-1)"
    )
      circle(
        r="18"
        fill="#5553"
      )
      la-angle-right(
        font-size="28"
        x="-17"
        y="-17"
      )
    g.cursor-pointer.opacity-50.transition-all.duration-200.ease(
      class="hover_opacity-100"
      transform="translate(-70,-10)"
      @mousedown="rotateAccents(1)"
    )
      circle(
        r="18"
        fill="#5553"
      )
      la-angle-left(
        font-size="28"
        x="-17"
        y="-17"
      )
  g(
    text-anchor="middle",
    style="user-select:none;transition:all 300ms ease"
  )
    g.steps(
      :opacity="volume * 0.9 + 0.1"
      transform="translate(0,90)"
    )

      g.lines(transform="translate(0,100)")
        line(
          :x1="pad"
          :x2="proportion * (steps.length) * width + pad"
          stroke="currentColor"
          stroke-width="2"
        )
        line(
          v-for="(step, s) in activeSteps" :key="step"
          :x1="proportion * (step) * width + pad"
          :x2="proportion * (activeSteps[s + 1] || steps.length) * width + pad"
          stroke-width="6"
          :stroke="levelColor((step + (tempo.pitch / 12) * steps.length), steps.length, 1)"
        )
      beat-bars-step(
        v-for="(step, s) in steps"
        :key="s"
        @mute="mutes[s] = !mutes[s]"
        @subdivide="steps[s] = $event"
        @accent="accents[s] = !accents[s]"
        :muted="mutes[s]"
        :step="s"
        :accented="Boolean(accents[s])"
        :mutes="mutes"
        :current="current"
        :subdivisions="step"
        :proportion="proportion"
        :total="steps.length"
        :width="width"
        :pad="pad"
      )
      g.arrows.pointer-events-none
        line(
          :transform="`translate(${pad + progress * width * proportion * loop.over}, 0)`"
          stroke-width="4"
          stroke="currentColor"
          stroke-linecap="round"
          :y2="180"
        )
      circle(
        :cx="proportion * (steps.length) * width + pad"
        :cy="100"
        :r="!mutes[1] ? 8 : 4"
        :fill="!mutes[1] ? pitchColor(tempo.pitch, 4) : 'currentColor'"
      )
    g.bottom(transform="translate(40,290)")
      beat-control-bar.volume(
        v-model="volume"
        :width="200"
        :step="0.01"
      )
        g(transform="translate(-20 -30)")
          la-volume-off(
            v-if="volume == 0"
            ) 
          la-volume-up(
            v-else
            )
      beat-control-bar.pan(
        transform="translate(270,0)"
        v-model="panning"
        :min="-1"
        :max="1"
        :width="200"
        :step="0.01"
        show-center
      )
        mdi-pan-horizontal(
          :x="-18"
          :y="-30"
        )
      beat-control-bar.sound(
        transform="translate(540,0)"
        v-model="soundControl"
        :width="320"
        :step="1"
        :min="0"
        :max="4"
        show-positions
        :every="1"
      )
        text {{ loop?.sound }}
      g.del.cursor-pointer(
        @mousedown="$emit('del')"
        :transform="`translate(900, 0)`"
        v-if="editable"
        )
        rect(
          style="filter:url(#shadowButton)"
          width="50"
          height="50"
          stroke-width="3"
          rx="40"
          :fill="isDark ? 'hsla(0,0%,30%,1)' : 'hsla(0,0%,100%,1)'"
          )
        la-trash(
          color="hsla(0,25%,50%,1)"
          stroke-width=0
          y="9"
          x="9"
          font-size="26"
        )
</template>

<style lang="postcss" scoped>
g {
  transition: fill 300ms ease;
}
.active {
  stroke: currentColor;
}
</style>