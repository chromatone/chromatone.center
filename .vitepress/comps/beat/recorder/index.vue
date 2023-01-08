<script setup>
import { isDark } from '#/theme/composables/state.js'
const props = defineProps({
  recorder: Object,
})
const emit = defineEmits(['close'])
</script>

<template lang='pug'>
g.recorder
  rect(
    style="filter:url(#shadowButton);"
    width="600"
    height="200"
    rx="100"
    :fill="isDark ? '#333e' : '#ddde'"
  )
  g.close.cursor-pointer(transform="translate(300 150)" )
    circle(
      r="40" 
      :fill="isDark ? '#333e' : '#ddde'"
      style="filter:url(#shadowButton);" 
      @mousedown="$emit('close')"
      )
    la-times.pointer-events-none( font-size="40px" x="-25" y="-25")
  g.add(v-for="(sound, s) in ['main', 'accent']" :key="sound")
    rect(
      :x="40 + s * 300"
      y="40"
      fill="none"
      width="220"
      height="120"
      stroke="currentColor"
      :stroke-width="recorder[sound] ? 10 : 2"
      stroke-opacity="0.5"
      rx="60"
    )
    g.record.cursor-pointer(
      :transform="`translate(${100 + 400 * s} ${100})`"
    )
      circle(
        @mousedown="recorder.rec(sound)" 
        class="opacity-60 hover-opacity-80 transition-all duration-200 ease " 
        r="40" fill="#900" 
        :stroke="recorder.recording == sound ? '#666' : 'transparent'" stroke-width="4" 
        style="filter:url(#shadowButton);" 
        )
    g.load.cursor-pointer(
      :transform="`translate(${160 + 200 * s} ${50})`"
    )
      foreignObject.p-4(width="110" height="110")
        label.transition-all.duration-200.ease.cursor-pointer.text-4xl.rounded-full.px-4.pb-6.pt-2(:for="sound" class="hover-bg-light-200 dark-(hover-bg-dark-100) bg-light-400 shadow-lg dark-bg-dark-300")
          la-upload
        input.hidden(type="file" :id="sound" @change="recorder.load(sound, $event.target.files[0])")
</template>