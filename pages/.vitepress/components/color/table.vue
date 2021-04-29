<template lang="pug">
.flex.flex-col  
  .flex.p-4(:style="{ backgroundColor: lchToHsl(i) }",v-for="i in 12", :key="i") {{ lchToHsl(i) }}
</template>

<script setup>
import { colord, extend } from "colord";
import lchPlugin from "colord/plugins/lch";

extend([lchPlugin]);

function lchToHsl(n) {
  return colord(`lch(80% 60 ${n * 30}`).toHslString()
};

// https://www.npmjs.com/package/colord#plugins

</script>

<style scoped>
</style>