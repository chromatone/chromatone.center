<script setup>
import { zzfxM } from './zzfxm';
import { zzfxP, zzfxX } from './zzfx';
import { ref } from 'vue';

import defaultSong from './songs/index?raw'

const instrumentParams = {
  volume: "VOL",
  randomness: "RND",
  frequency: "FRQ",
  attack: "ATT",
  sustain: "SUS",
  release: "REL",
  shape: "SHP",
  shapeCurve: "SHC",
  slide: "SLI",
  deltaSlide: "DLS",
  pitchJump: "PJM",
  pitchJumpTime: "PJT",
  repeatTime: "RPT",
  noise: "NOI",
  modulation: "MOD",
  bitCrush: "BIT",
  delay: "DEL",
  sustainVolume: "SUV",
  decay: "DEC",
  tremolo: "TRM",
}

const song = ref(parse(defaultSong))
const isPlaying = ref(false)
let node

async function play() {
  if (isPlaying.value) return
  let mySongData = zzfxM(...song.value);
  node = zzfxP(...mySongData)
  node.loop = true;
  await zzfxX.resume()
  isPlaying.value = true
}

async function stop() {
  if (!isPlaying.value) return
  node.stop();
  node.disconnect();
  node = null;
  await zzfxX.suspend();
  isPlaying.value = false
}

function parse(str) {
  str = str.replace(/,\s*(?=[,\]])/g, ',null').replace(/(?<=\[)\s*,/g, 'null,');
  str = str.replace(/(\D)\.(\d)/g, '$10.$2');

  return JSON.parse(str, (key, value) => {
    if (value === null) {
      return undefined;
    }
    return value;
  });
};


</script>

<template lang='pug'>
.p-5.flex.flex-col.mt-20
  .flex.items-center.gap-2.p-4.sticky.top-12.backdrop-blur-xl.self-start
    a.text-4xl(href="https://github.com/keithclark/ZzFXM" target="_blank") FXM
    button.text-button.p-8.text-xl(@click="play()") PLAY
    button.text-button.p-8.text-xl(@click="stop()") STOP
  .flex.flex-col.gap-2

    .p-4.flex.flex-col.gap-2.overflow-x-scroll
      .text-xl.sticky.left-0 Instrument list
      .p-0.flex.gap-1
        .p-0(v-for="(param, p) in instrumentParams" :key="param")
          .text-center.text-sm.dark-bg-dark-8.py-1.rounded-lg.w-10(:title="p" v-tooltip="p") {{ param }}
      .p-0.flex.gap-1(v-for="(instrument, ins) in song[0]" :key="instrument")
        .p-0(v-for="(param, p) in 20" :key="param")
          input.text-center.text-sm.dark-bg-dark-8.py-1.rounded-lg.w-10(  v-model="song[0][ins][p]" )

    .p-2.flex.flex-col.gap-4
      .text-xl Pattern list
      .flex.gap-1.flex-col.overflow-x-scroll.py-2(v-for="(track, t) in song[1]" :key="t") 
        .p-0.flex.gap-1(v-for="(pattern, p) in track" :key="p")
          .p-0(v-for="(step, s) in pattern" :key="s") 
            input.text-center.text-sm.dark-bg-dark-8.py-1.rounded-lg.w-10(v-model="song[1][t][p][s]")

    .p-2.flex.flex-col.gap-2 
      .text-xl Sequence
      .flex.gap-1.overflow-x-scroll.py-2
        input.text-center.text-sm.dark-bg-dark-8.py-1.rounded-lg.w-10(v-for="seq in song[2]" :key="seq"  v-model="song[2][seq]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Speed
      input.dark-bg-dark-8.p-2.rounded-lg(
        v-model="song[3]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Metadata 
      .flex.flex-col.gap-4 
        .p-0.flex.gap-2(v-for="(param, p) in song[4]" :key="p")
          .text-lg.capitalize {{ p }}:
          input(v-model="song[4][p]")


</template>