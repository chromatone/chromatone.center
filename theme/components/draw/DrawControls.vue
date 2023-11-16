<script setup>
import { useDraw } from '#/theme/composables/draw'
import { midi } from '#/use/midi'
import { noteColor } from "#/use/colors"
import { useRoute } from 'vitepress'
import { onMounted, watch } from 'vue';

const route = useRoute()

const { brush, brushColors, canClear,
  canRedo, canUndo, clearDrauu,
  drauu, drawingEnabled, drawingMode, brushSizes, drawingPinned, currentPage } = useDraw()

onMounted(() => {
  watch(route, (r) => currentPage.value = r.path, { immediate: true })
})

function undo() {
  drauu.undo()
}
function redo() {
  drauu.redo()
}

function setDrawingMode(mode) {
  drawingMode.value = mode
  drawingEnabled.value = true
}
function setBrushColor(color) {
  brush.color = color
  drawingEnabled.value = true
}

watch(() => midi.note, note => {
  brush.color = noteColor(note.pitch)
})

</script>

<template lang="pug">
.panel(
  :class="drawingEnabled ? '' : drawingPinned ? 'opacity-40 hover-opacity-90' : 'opacity-0 pointer-events-none'", 
  storage-key="slidev-drawing-pos", 
  :initial-x="10", 
  :initial-y="10"
  )
  button.w-6.flex.items-center.justify-center(@click="brush.size = brushSizes.next()")
    .bg-current.rounded-full(:style="{ width: brush.size + 4 + 'px', height: brush.size + 4 + 'px', backgroundColor: brush.color }")
  .is-group.flex.gap-2.px-2.py-1
    button(:class="{ active: drawingMode == 'stylus' }", @click="setDrawingMode('stylus')")
      .i-carbon-pen

    button(:class="{ active: drawingMode == 'line' }", @click="setDrawingMode('line')")
      svg.-mt-1(width="1em", height="1em", preserveAspectRatio="xMidYMid meet", viewBox="0 0 24 24")
        path(d="M21.71 3.29a1 1 0 0 0-1.42 0l-18 18a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l18-18a1 1 0 0 0 0-1.42z", fill="currentColor")
    button(:class="{ active: drawingMode == 'arrow' }", @click="setDrawingMode('arrow')")
      .i-carbon-arrow-up-right

    button(:class="{ active: drawingMode == 'ellipse' }", @click="setDrawingMode('ellipse')")
      .i-carbon-radio-button

    button(:class="{ active: drawingMode == 'rectangle' }", @click="setDrawingMode('rectangle')")
      .i-carbon-checkbox

  //  TODO: not sure why it's not working! 
  //
    <button class="icon-btn" :class="{ shallow: drawingMode != 'eraseLine' }" @click="setDrawingMode('eraseLine')">
      <i-carbon-erase />
      </button> 

  .is-group.flex.flex-wrap
    button(
      v-for="color of brushColors", :key="color", 
      :class="brush.color === color ? 'active' : 'shallow'", 
      @click="setBrushColor(color)"
      )
      .w-6.h-6.transition-all.transform.border.border-gray-400.border-opacity-50(
        :class="brush.color !== color ? 'rounded-1/2 scale-85' : 'rounded-md'", 
        :style="drawingEnabled ? { background: color } : { borderColor: color }"
        )

  .is-group.flex.gap-2.px-2
    button(:class="{ disabled: !canUndo }", @click="undo()")
      .i-carbon-undo
    button(:class="{ disabled: !canRedo }", @click="redo()")
      .i-carbon-redo

    button(:class="{ disabled: !canClear }", @click="clearDrauu()")
      .i-carbon-delete
  .flex-1
  button(:class="{ shallow: !drawingPinned }", @click="drawingPinned = !drawingPinned")
    .i-carbon-pin-filled.transform.-rotate-45(v-show="drawingPinned")
    .i-carbon-pin(v-show="!drawingPinned")


  button(v-if="drawingEnabled", :class="{ shallow: !drawingEnabled }", @click="drawingEnabled = !drawingEnabled")
    .i-carbon-error(v-show="drawingPinned")
    .i-carbon-close-outline(v-show="!drawingPinned")
            
</template>


<style lang="postcss" scoped>
.panel {
  @apply z-500 flex flex-wrap text-xl p-2 gap-2 rounded-md bg-main shadow transition-opacity duration-200 dark-border dark-border-gray-400 dark-border-opacity-10 bg-light-300 dark-bg-dark-300 justify-center;
}

button {
  transition: all 100ms ease-out;
  @apply p-0.5 transform hover-bg-opacity-0 hover-bg-dark-900;
}

button svg,
button div {
  transition: all 100ms ease-out;
  @apply transform scale-80 hover-scale-120;
}

.active {
  @apply bg-opacity-50 scale-150;
}
</style>