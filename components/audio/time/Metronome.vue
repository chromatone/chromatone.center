<script setup>
import { onMounted, reactive, computed, ref } from 'vue'

import { levelColor, notes, pitchColor } from '#/use'

import { useElementary } from '#/use/elementary/useElementary';
import { useTime } from '#/use/elementary/useTime';
// import ControlKnob from '@slipmatio/control-knob'

const { time, controls, groups, transport } = useTime()

const loop = reactive({
  width: 100,
  height: 22
})

const { render, audio } = useElementary()


const steps = computed(() => Math.round(controls['time:steps']))

const started = ref(false)

</script>

<template lang='pug'>
#screen.flex.flex-col.gap-2.bg-light-200.bg-opacity-40.dark-bg-dark-400.dark-bg-opacity-40.backdrop-blur.pt-2.px-2.rounded-xl.shadow-xl.border-1.border-dark-200.border-opacity-20.dark-border-light-200.dark-border-opacity-30(v-if="audio?.started")
  .p-1.rounded-full(:style="{ backgroundColor: time.pulse ? 'currentColor' : 'transparent' }")
  svg.w-full.rounded.select-none(:viewBox="`0 0 ${loop.width} ${loop.height}`")
    rect(
      fill="#8881"
      stroke="#aaa"
      stroke-width=".2"
      :width="loop.width"
      :height="loop.height")

    g.beats   
      g.beat(
        v-for="(s, b) in steps" :key="b"
        :transform="`translate(${b * loop.width / steps},0)`" )
        rect(
          :width="loop.width / steps"
          :height="loop.height"
          :fill="b != Math.floor(time.step) ? '#6662' : levelColor(b + (time.pitch / 12) * steps, steps, 1)")
        line(
          :stroke="levelColor(b + (time.pitch / 12) * steps, steps)"
          stroke-width=".3"
          :y2="loop.height")
        text(
          :x="2 - steps / 10"
          :y="loop.height - 2"
          :font-size="16 - steps / 1.5"
          :fill="b == Math.floor(time.step) ? 'currentColor' : levelColor(b + (time.pitch / 12) * steps, steps, 1)"
          :font-weight="b == Math.floor(time.step) ? 'bold' : 'normal'"
        ) {{ s }}

    g.progress
      rect(
        :fill="pitchColor(time.pitch)"
        fill-opacity=".2"
        :width="time.measure * loop.width"
        :height="loop.height")
      line(
        stroke="currentColor"

        stroke-width="1"
        :x1="time.measure * loop.width"
        :x2="time.measure * loop.width"
        :y2="loop.height")

  .flex.flex-wrap.m-2.flex.flex-wrap.gap-4
    .is-group.items-center.flex.p-2.flex-wrap(style="flex: 160px")
      button.text-button(@click="time.isPlaying ? transport.pause() : transport.play()" v-show="started")
        .i-la-play(v-if="!time.isPlaying")
        .i-la-pause(v-else)
      button.text-button(@click="transport.stop()" v-show="started")
        .i-la-stop
      button.text-button(@click="started = true; controls['time:click'] = controls['time:click'] ? 0 : 1") 
        .i-la-volume-up(v-if="controls['time:click']")
        .i-la-volume-mute(v-else)
      .p-2(v-show="!started") Press to start
    .is-group.flex.flex-wrap.items-center(
      style="flex: 180px"
      v-for="(group, title) in groups" :key="title")
      .select-none.relative.flex.flex-col.gap-4.items-center(v-for="(param, p) in group" :key="p")
        ControlRotary(
          v-if="p != 'click'"
          :min="param.min"
          :max="param.max"
          :step="param.step"
          v-model="controls[`${title}:${p}`]"
          :param="String(p)"
          )
</template>

<style scoped lang="postcss">
.active {
  @apply bg-dark-300 dark-bg-light-300 bg-opacity-40 dark-bg-opacity-40;
}
</style>