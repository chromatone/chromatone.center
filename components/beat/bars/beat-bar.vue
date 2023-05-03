<script setup lang="ts">
import BarStep from './step.vue'
import { isDark } from '#/theme/composables/state'
import { useSequence } from '#/use/sequence'
import { computed, ref, watch } from 'vue'
import { noteColor, levelColor } from '#/use/colors'
import { tempo } from '#/use/tempo'

const emit = defineEmits(['del', 'sound']);

const props = defineProps({
  order: { type: Number, default: 0 },
  loop: { type: Object, default: { over: 4, under: 4, sound: 'A', volume: 1, } },
  maxRatio: { type: Number, default: 1 },
  editable: { type: Boolean, default: false, },
  mute: { type: String, default: null, },
  accents: { type: String, default: null },
  width: { type: Number, default: 920 }
});

const pad = computed(() => (1000 - props.width) / 2)

//@ts-expect-error
const { seq } = useSequence(props.loop, props.order, 'bars');

const sounds = ['A', 'B', 'C', 'D', 'E']
const soundControl = ref(sounds.findIndex(el => el == seq.meter?.sound))

watch(soundControl, num => {
  seq.meter.sound = sounds[num]
})

const proportion = computed(() => {
  const ratio = 1 / seq.meter.over
  return ratio >= props.maxRatio ? props.maxRatio : ratio
})

watch(() => props.loop, l => {
  seq.meter = { ...props.loop }
}, { immediate: true })

watch(() => props.accents, accents => {
  if (accents) {
    accents.split('').forEach((sign, m) => {
      seq.mutes[m] = (sign == '0' || sign == '.')
      seq.accents[m] = (sign == '2' || sign == 'X')
    })
  }
}, { immediate: true });

</script>


<template lang="pug">
svg.w-full(
  class="bg-light-300 dark-bg-dark-800"
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
      v-model="seq.meter.over"
      :width="340"
      :step="1"
      :min="2"
      :max="16"
      show-positions
      :ratio="500"
      :every="4"
      v-tooltip.top="'Number of steps'"
    )
    beat-control-bar.under(
      transform="translate(580,0)"
      v-model="seq.meter.under"
      :width="340"
      :step="1"
      :min="1"
      :max="16"
      show-positions
      :ratio="500"
      :every="4"
      inverted
      :vector="[-1, -1]"
      v-tooltip.top="'Measure subdivision'"
    )

  g.info(
    :transform="`translate(500,53)`"
    )
    g.signature(v-tooltip.top="'Time signature'")
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
        ) {{ seq.meter.over }} 
      text(
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="40px"
        text-anchor="start",
        :x="10",
        ) {{ seq.meter.under }} 

    g.cursor-pointer.opacity-50.transition-all.duration-200.ease(
      class="hover-opacity-100"
      transform="translate(70,-10)"
      @mousedown="seq.rotateAccents(-1)"
      v-tooltip.top="'Rotate pattern backward'"
    )
      circle(
        r="18"
        fill="#5553"
      )
      i-la-angle-right(
        font-size="28"
        x="-17"
        y="-17"
      )
    g.cursor-pointer.opacity-50.transition-all.duration-200.ease(
      class="hover-opacity-100"
      transform="translate(-70,-10)"
      @mousedown="seq.rotateAccents(1)"
      v-tooltip.top="'Rotate pattern forward'"
    )
      circle(
        r="18"
        fill="#5553"
      )
      i-la-angle-left(
        font-size="28"
        x="-17"
        y="-17"
      )
  g(
    text-anchor="middle",
    style="user-select:none;transition:all 300ms ease"
  )
    g.steps(
      :opacity="seq.volume * 0.9 + 0.1"
      transform="translate(0,90)"
    )

      g.lines(transform="translate(0,100)")
        line(
          :x1="pad"
          :x2="proportion * (seq.steps.length) * width + pad"
          stroke="currentColor"
          stroke-width="2"
        )
        line(
          v-for="(step, s) in seq.activeSteps" :key="s"
          :x1="proportion * Number(step) * width + pad"
          :x2="proportion * (seq.activeSteps[s + 1] || seq.steps.length) * width + pad"
          stroke-width="6"
          :stroke="levelColor((Number(step) + (Number(tempo.pitch) / 12) * seq.steps.length), seq.steps.length, 1)"
        )
      bar-step(
        v-for="(step, s) in seq.steps"
        :key="s"
        @mute="seq.mutes[s] = !seq.mutes[s]"
        @subdivide="seq.steps[s] = $event"
        @accent="seq.accents[s] = !seq.accents[s]"
        :muted="seq.mutes[s]"
        :step="s"
        :accented="Boolean(seq.accents[s])"
        :mutes="seq.mutes"
        :current="seq.current"
        :subdivisions="step"
        :proportion="proportion"
        :total="seq.steps.length"
        :width="width"
        :pad="pad"
      )
      g.arrows.pointer-events-none
        line.progress(
          :transform="`translate(${pad + seq.progress * width * proportion * seq.meter.over}, 0)`"
          stroke-width="4"
          stroke="currentColor"
          stroke-linecap="round"
          :y2="180"
        )
      circle(
        :cx="proportion * (seq.steps.length) * width + pad"
        :cy="100"
        :r="!seq.mutes[1] ? 8 : 4"
        :fill="!seq.mutes[1] ? noteColor(Number(tempo.pitch), 4) : 'currentColor'"
      )
    g.bottom(transform="translate(40,290)")
      beat-control-bar.volume(
        v-model="seq.volume"
        :width="200"
        :step="0.01"
        v-tooltip.bottom="'Track volume'"
      )
        g(transform="translate(-20 -30)")
          i-la-volume-off(
            v-if="seq.volume == 0"
            ) 
          i-la-volume-up(
            v-else
            )
      beat-control-bar.pan(
        transform="translate(270,0)"
        v-model="seq.pan"
        :min="-1"
        :max="1"
        :width="200"
        :step="0.01"
        show-center
        v-tooltip.bottom="'Track panning'"
      )
        i-mdi-pan-horizontal(
          :x="-18"
          :y="-30"
        )
      beat-control-bar.sound(
        transform="translate(540,0)"
        v-model="soundControl"
        :width="265"
        :step="1"
        :min="0"
        :max="4"
        show-positions
        :every="1"
        v-tooltip.bottom="'Click sound select'"
        )
        text {{ seq.meter?.sound }}
      transition(name="fade")
        g.reset.cursor-pointer(
          @mousedown="seq.reset()"
          :transform="`translate(840, 0)`"
          v-if="editable && !seq.isEuclidean"
          v-tooltip.bottom="'Reset to Euclidean pattern'"
          )
          rect(
            style="filter:url(#shadowButton)"
            width="50"
            height="50"
            stroke-width="3"
            rx="40"
            :fill="isDark ? 'hsla(0,0%,30%,1)' : 'hsla(0,0%,100%,1)'"
            )
          i-tabler-stairs(
            stroke-width=0
            y="9"
            x="9"
            font-size="26"
            )
      g.del.cursor-pointer(
        @mousedown="$emit('del')"
        :transform="`translate(900, 0)`"
        v-if="editable"
        v-tooltip.bottom="'Remove track'"
        )
        rect(
          style="filter:url(#shadowButton)"
          width="50"
          height="50"
          stroke-width="3"
          rx="40"
          :fill="isDark ? 'hsla(0,0%,30%,1)' : 'hsla(0,0%,100%,1)'"
          )
        i-la-trash(
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