<template lang="pug">
.flex.flex-col.items-center.w-full.p-4.has-bg.rounded-xl#screen.relative
  client-only 
    state-transport
    full-screen.absolute.bottom-2.right-2
    svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
      beat-circle-loop(
        v-for="(loop,i) in loops",
        :key="i"
        :order="i"
        :loop="loop"
        :radius="380 - i * 200"
        :size="200"
        @del="loops.splice(i, 1)"
        @over="changeLoop(i, 'over', $event)"
        @under="changeLoop(i, 'under', $event)"
        @sound="loop.sound = $event"
      )
</template>

<script setup>

const loops = useStorage('tempo-circle-loops', [
  {
    over: 8,
    under: 8,
    volume: 1,
    sound: 'A'
  },
  {
    over: 3,
    under: 3,
    volume: 0.5,
    sound: 'B'
  }]
);

function changeLoop(l, n, diff) {
  let num = loops.value[l][n] + diff
  if (num >= 1 && num <= 32) {
    loops.value[l][n] = num
  }
}

</script>

<style scoped>
</style>