<script setup>
import { useDraggable, useEventListener, useStorage } from "@vueuse/core";
import { computed, onMounted, ref, watchEffect } from "vue";
import { cast, currentCamera } from "#/use/cast";

const size = useStorage(
  "cast-cam-size",
  Math.round(Math.min(window.innerHeight, window.innerWidth / 4))
);

const zoom = useClamp(useStorage('cast-cam-zoom', 1), 1, 3)

const position = useStorage("cast-cam-pos", {
  x: window.innerWidth - size.value - 30,
  y: window.innerHeight - size.value - 30,
});

const frame = ref();
const handler = ref();
const zoomHandler = ref()
const video = ref();

const { streamCamera, showAvatar } = cast;

const { style: containerStyle } = useDraggable(frame, { initialValue: position });

const { isDragging: handlerDown } = useDraggable(handler, {
  onMove({ x, y }) {
    size.value = Math.max(
      10,
      Math.min(x - position.value.x, y - position.value.y) / 0.8536
    );
  },
});

function dragZoom(drag) {
  zoom.value -= drag.delta[1] / 100
}

watchEffect(
  () => {
    if (video.value) {
      video.value.srcObject = streamCamera.value;
    }
  },
  { flush: "post" }
);

const frameStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
}));

const handleStyle = computed(() => ({
  width: "14px",
  height: "14px",
  // 0.5 + 0.5 / sqrt(2)
  top: `${size.value * 0.8536 - 7}px`,
  left: `${size.value * 0.8536 - 7}px`,
  cursor: "nwse-resize",
}));

const zoomStyle = computed(() => ({
  width: "14px",
  height: "14px",
  // 0.5 + 0.5 / sqrt(2)
  top: `${(1 - (zoom.value - 1) / 2) * size.value}px`,
  right: `12px`,
  cursor: "ns-resize",
}));

function fixPosition() {
  // move back if the camera is outside of the canvas
  if (position.value.x >= window.innerWidth)
    position.value.x = window.innerWidth - size.value - 30;
  if (position.value.y >= window.innerHeight)
    position.value.y = window.innerHeight - size.value - 30;
}

useEventListener("resize", fixPosition);
onMounted(fixPosition);
</script>

<template lang="pug">
.avatar.fixed.z-1000(
  v-if="streamCamera && showAvatar && currentCamera !== 'none'", 
  :style="containerStyle"
  )
  .rounded-full.shadow.bg-gray-400.bg-opacity-10.overflow-hidden.object-cover.shadow-lg(
    ref="frame", 
    :style="frameStyle"
    )
    video.object-cover.min-w-full.min-h-full.rounded-full(
      ref="video", 
      autoplay, 
      muted, 
      volume="0", 
      :style="`transform: rotateY(180deg) scale(${zoom})`"
      )
  .absolute.bottom-0.right-0.rounded-full.shadow-lg.shadow.z-30.p-2.bg-violet-500.bg-opacity-40.hover-bg-opacity-100(
    :style="zoomStyle", 
    v-drag="dragZoom"
    ) 
  .absolute.bottom-0.right-0.rounded-full.shadow-lg.shadow.z-30.p-2.bg-purple-500.bg-opacity-40.hover-bg-opacity-100(
    ref="handler", 
    :style="handleStyle", 
    :class="handlerDown ? '!opacity-100' : ''"
    ) 
</template>

<style lang="postcss" scoped>

</style>
