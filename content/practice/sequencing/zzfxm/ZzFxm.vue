<script setup>
import { zzfxM } from './zzfxm';
import { zzfxP, zzfxX } from './zzfx';
import { ref } from 'vue';

import defaultSong from './songs/index?raw'

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
    .p-2.flex.flex-col.gap-2
      .text-xl Instruments
      input.dark-bg-dark-8.p-2.rounded-lg(disabled v-for="(instrument, ins) in song[0]" :key="instrument" v-model="song[0][ins]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Patterns
      input.dark-bg-dark-8.p-2.rounded-lg(disabled v-for="(instrument, ins) in song[1]" :key="instrument" v-model="song[1][ins]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Sequence
      input.dark-bg-dark-8.p-2.rounded-lg(disabled  v-model="song[2]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Speed
      input.dark-bg-dark-8.p-2.rounded-lg(
        v-model="song[3]")
    .p-2.flex.flex-col.gap-2 
      .text-xl Metadata
      .font-mono.dark-bg-dark-8.p-2.rounded-lg {{ song[4] }}

</template>