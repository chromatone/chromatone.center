<template lang="pug">
.flex.flex-col
  midi-panel.mb-4
  #screen.flex.flex-col.w-full.items-stretch.relative.fullscreen-container.rounded-xl.shadow-xl
    full-screen.absolute.top-1.right-1
    canvas.max-w-full.max-h-full.h-full.w-full.min-h-600px(
      style="cursor:none"
      resize="true"
      ref="screen"
      width="1000"
      height="1000"
    )
      div(v-if="loaded")
        draw-layer-pointer
        draw-layer-clock(:channel="5" to-center :grow="400")
        draw-layer-clock(:channel="7")
        draw-layer-clock(:channel="8" :grow="100")
</template>

<script setup>
import paper from 'paper'
const screen = ref()

const loaded = ref(false)

onMounted(() => {
  paper.setup(screen.value)
  paper.view.draw()
  loaded.value = true
});
onBeforeUnmount(() => {
  paper.project.clear()
  loaded.value = false
});

</script>
