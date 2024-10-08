<script setup>
import { useRafFn, useStorage, useWindowSize } from "@vueuse/core";
import { useMidi } from "#/use/midi";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useClamp } from "@vueuse/math";
import { noteColor } from "#/use";

const { midi, stopAll, channels, guessChords } = useMidi()

const { width, height } = useWindowSize()

const score = reactive({
  notes: computed(() => {
    let activeNotes = [];
    for (let ch in channels) {
      for (let n in channels[ch].notes) {
        let note = channels[ch].notes[n];
        if (note.velocity > 0) {
          activeNotes.push(note);
        }
      }
    }
    return activeNotes;
  }),
  startTime: Date.now(),
  endTime: Date.now(),
});

watch(
  () => midi.playing,
  (playing) => {
    if (playing) {
      score.startTime = midi.note?.timestamp || Date.now();
    } else {
      score.endTime = midi.note?.timestamp || Date.now();
    }
  }
);

let canvas, ctx, tempCanvas, tempCtx;

const state = reactive({
  initiated: false,
  width,
  height,
  speed: computed(() => Math.round(state.rawSpeed * 2) / 2),
  rawSpeed: useClamp(useStorage("midi-roll-speed", 1), 1, 3),
  direction: useStorage("midi-roll-direction", 1),
});

watch([width, height], () => {
  if (!tempCanvas) return
  tempCanvas.width = state.width;
  tempCanvas.height = state.height;
})

onMounted(() => {
  canvas = document.getElementById("spectrogram");
  ctx = canvas.getContext("2d");
  tempCanvas = document.createElement("canvas");
  tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = state.width;
  tempCanvas.height = state.height;
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, state.width, state.height);
  initiate();
});

function initiate() {
  if (state.initiated) return;
  state.initiated = true;
  useRafFn(onCanvasDraw);
}

function onCanvasDraw() {
  if (state.direction == 1) {
    drawVertical();
  } else {
    drawHorizontal();
  }
}

function drawVertical() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height);
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, state.height - state.speed, state.width, state.speed);
  for (let i = 0; i < 127; i++) {
    let num = (i * state.width) / 127;
    ctx.fillStyle = noteColor(i + 3, 0, .5, .25);
    ctx.fillRect(num, state.height - state.speed, 1, state.speed);
  }
  ctx.translate(0, -state.speed);
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height);
  score.notes.forEach((note) => {
    const size = 16 - note.channel;
    ctx.fillStyle = noteColor(note.number - 9, 0, 1);
    ctx.fillRect(
      (note.number * state.width) / 127 - size / 2,
      state.height - state.speed,
      size,
      state.speed * 2
    );
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHorizontal() {
  tempCtx.drawImage(canvas, 0, 0, state.width, state.height);
  ctx.fillStyle = "#333333";
  ctx.fillRect(state.width - state.speed, 0, state.speed, state.height);
  // for (let i = 0; i < 127; i++) {
  //   let num = (127 - i) * (state.height / 127)
  //   ctx.fillStyle = colorIt((i + 3) % 12, 0.5, 0.5)
  //   ctx.fillRect(0, state.height - num, state.width, 0.5)
  // }
  score.notes.forEach((note) => {
    ctx.fillStyle = colorIt((note.number + 3) % 12, 1);
    ctx.fillRect(
      state.width - state.speed,
      state.height - (note.number * state.height) / 127,
      state.speed,
      12 - note.channel / 2
    );
  });
  ctx.translate(-state.speed, 0);
  ctx.drawImage(tempCanvas, 0, 0, state.width, state.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // score.notes.forEach(note => {
  //   ctx.fillStyle = colorIt((note + 3) % 12, 1)
  //   ctx.beginPath();
  //   ctx.arc(state.width - 4, state.height - note * 2, 1, 0, 2 * Math.PI, false);
  //   ctx.fill();
  // })
}

function colorIt(pitch = 0, value = 1, opacity = 1) {
  return `hsla(${pitch * 30}, ${value * 100}%, ${value * 60}%, ${opacity})`;
}

function dragSpeed(drag) {
  let diff = drag.delta[0] - drag.delta[1];
  if (diff != 0) {
    state.rawSpeed += diff / 500
  } else if (drag.active) {
    midi.playing = !midi.playing
  }
}


</script>

<template lang="pug">
.flex.flex-col.items-center.w-full.touch-none.select-none
  .fullscreen-container#screen
    control-start.absolute( 
      v-if="!state.initiated", 
      @click="initiate()") Start
    button.p-2.absolute.top-2.right-2(@click="state.direction ? state.direction = 0 : state.direction = 1")
      .i-la-arrow-up(v-if="state.direction == 1")
      .i-la-arrow-left(v-if="state.direction == 0")
    button.absolute.bottom-2.right-2.p-2(@click="midi.playing = !midi.playing")
      .i-la-play(v-if="!midi.playing")
      .i-la-pause(v-else)
    button.absolute.bottom-2.left-2.p-2(@click="stopAll()")
      .i-la-stop
    .absolute.bottom-1.left-8.text-white.p-2
      .text-lg {{ guessChords[0] }}
    .absolute.top-2.left-2.text-white.p-2(
      )
      .text-lg x{{ state.speed }}
    canvas#spectrogram.max-h-100vh.w-full.cursor-pointer(
      v-drag="dragSpeed"
      :width="state.width"
      :height="state.height"
      @dblclick="stopAll()"
      )
</template>
