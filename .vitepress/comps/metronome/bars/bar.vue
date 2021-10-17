<template lang="pug">
svg.w-full(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 1000 310`",
  xmlns="http://www.w3.org/2000/svg",
  style="user-select:none;touch-action:none"
  )
  g(
    text-anchor="middle",
    style="user-select:none;transition:all 300ms ease"
  )
    rect(
      width="1000"
      height="310"
      stroke-width="2"
      stroke="currentColor"
      opacity="0.1"
      fill="currentColor"
    )
    g.steps(
      :opacity="volume / 2 + 0.5"
      transform="translate(0,100)"
    )
      line(
        transform="translate(0, 180)"
        :x1="pad"
        :x2="proportion * (steps.length) * width + pad"
        stroke="currentColor"
        stroke-width="4"
      )
      line(
        :transform="`translate(${proportion * (steps.length) * width + pad}, 0)`"
        stroke-width="4"
        stroke="currentColor"
        stroke-linecap="round"
        :y2="180"
      )
      metronome-bars-step(
        v-for="(step,s) in steps"
        :key="s"
        @mute="mutes[s + 1] = !mutes[s + 1]"
        @subdivide="steps[s] = $event"
        @accent="accents[s + 1] = !accents[s + 1]"
        :opacity="mutes[s + 1] ? 0.1 : 1"
        :step="s + 1"
        :accented="Boolean(accents[s + 1])"
        :mutes="mutes"
        :current="current"
        :subdivisions="step"
        :proportion="proportion"
        :total="steps.length"
        :width="width"
        :pad="pad"
      )
      g.arrows.pointer-events-none(
        style="mix-blend-mode:difference;"
      )
        line(
          :transform="`translate(${pad + progress * width * proportion * loop.over}, 0)`"
          stroke-width="8"
          stroke="currentColor"
          stroke-linecap="round"
          :y2="180"
        )


    g.sound.cursor-pointer(
      v-for="(sound,s) in sounds"
      :key="sound"
      @click="$emit('sound', sound)"
      :class="{ active: sound == loop.sound }"
      :transform="`translate(${s * 55 + 650},15)`"
      )
      rect(
        width="50"
        height="50"
        stroke-width="3"
        rx="15"
        :fill="isDark ? 'hsla(0,0%,30%,0.4)' : 'hsla(0,0%,100%,0.8)'"
        )
      text(
        fill="currentColor"
        stroke-width=0
        y="33"
        x="25"
        font-size="25"
      ) {{ sound }}
    g.del.cursor-pointer(
      @click="$emit('del')"
      :transform="`translate(930,15)`"
      v-if="editable"
      )
      rect(
        width="50"
        height="50"
        stroke-width="3"
        rx="15"
        :fill="isDark ? 'hsla(0,0%,30%,0.4)' : 'hsla(0,0%,100%,0.8)'"
        )
      la-trash(
        color="hsla(0,25%,50%,1)"
        stroke-width=0
        y="9"
        x="9"
        font-size="26"
      )

    g.vol(
      style="cursor:pointer;color:currentColor"
      :transform="`translate(40, 40)`"
      font-size="32px"
      v-drag="dragVol"
      @dblclick="volume > 0 ? volume = 0 : volume = 0.75"
      )
      rect(
        x="-10"
        y="-30"
        width="140"
        height="60"
        rx="20"
        fill="transparent"
      )
      line(
        x2="100"
        :stroke="isDark ? '#555' : '#fefefe'"
        stroke-width="12"
        stroke-linecap="round"
      )
      g.dragger.opacity-80(
        :transform="`translate(${volume * 100})`"
      )
        circle(
          :r="24"
          :cx="0"
          :cy="0"
          fill="var(--c-bg)"
        )
        la-volume-off(
          v-if="volume == 0"
          style=""
          :x="-20"
          :y="-20"
        )
        la-volume-up(
          v-else
          style=""
          :x="-20"
          :y="-20"
        )

    metronome-control-pan(
      v-model:pan="panning"
      :transform="`translate(240,40)`"
      :order="order"
    )

    g.info(
      :transform="`translate(480,50)`"
    )
      g.controls(
        transform="translate(0,-30)"
        font-size="30"
        v-if="editable"
      )
        g.under.cursor-pointer(
          @click="$emit('under', -1)"
          transform="translate(105,0)"
        )
          rect(
            width="40"
            height="40"
            rx="12"
            :fill="isDark ? '#222' : '#fff'"
          )
          la-minus
        g.over.cursor-pointer(
          @click="$emit('under', 1)"
          transform="translate(55,0)"
        )
          rect(
            width="40"
            height="40"
            rx="12"
            :fill="isDark ? '#222' : '#fff'"
          )
          la-plus
        g.over.cursor-pointer(
          @click="$emit('over', -1)"
          transform="translate(-145,0)"
        )
          rect(
            width="40"
            height="40"
            rx="12"
            :fill="isDark ? '#222' : '#fff'"
          )
          la-minus
        g.over.cursor-pointer(
          @click="$emit('over', 1)"
          transform="translate(-95,0)"
        )
          rect(
            width="40"
            height="40"
            rx="12"
            :fill="isDark ? '#222' : '#fff'"
          )
          la-plus

      text(
        fill="currentColor"
        font-size="45"
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

</template>

<script setup>
import { useSequence } from '@use/sequence.js'
import { isDark } from '@theme/composables/state.js'
import { clampNum } from '@use/theory'

const width = 950
const pad = (1000 - width) / 2

defineEmits(['del', 'over', 'under', 'sound']);

const props = defineProps({
  order: {
    type: Number,
    default: 0
  },
  loop: {
    type: Object,
    default: {
      over: 4,
      under: 4,
      sound: 'A',
      volume: 1,
    }
  },
  maxRatio: {
    type: Number,
    default: 1
  },
  editable: {
    type: Boolean,
    default: false,
  },
  mute: {
    type: String,
    default: '',
  },
  accent: {
    type: String,
    default: '10'
  }
});

const sounds = ['A', 'B', 'C', 'D', 'E']

const { progress, current, steps, mutes, accents, volume, panning } = useSequence(props.loop, props.order, 'bars');

const proportion = computed(() => ((props.loop.over / props.loop.under) / props.maxRatio) / props.loop.over)

function dragVol(drag) {
  volume.value = clampNum(volume.value, drag.delta[0] / 100, 0, 1)
}
watchEffect(() => {
  if (props.mute) {
    props.mute.split('').forEach((mute, m) => {
      mutes.value[m + 1] = mute == 1
    })
  }
  if (props.accent) {
    if (!props.mute) {
      props.accent.split('').forEach((accent, m) => {
        mutes.value[m + 1] = accent == 0
      })
    }
    props.accent.split('').forEach((accent, a) => {
      accents.value[a + 1] = accent == 1
    })
  }
  if (props.loop.volume !== undefined) {
    volume.value = props.loop.volume
  }
});


</script>

<style scoped>
g {
  transition: fill 300ms ease;
}
.active {
  stroke: currentColor;
}
</style>