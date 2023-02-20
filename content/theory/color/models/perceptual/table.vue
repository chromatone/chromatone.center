<script setup>
import { lchToHsl, levelColor } from '#/use/colors'

</script>

<template lang="pug">
table.w-full.my-8
  tr
    th HSL
    th LCH
  tr(v-for="(n, i) in 12", :key="i")
    td.p-8(:style="{ backgroundColor: levelColor(i, 12, 1) }") 
    td.p-8(:style="{ backgroundColor: lchToHsl(i + 1, 12, 1, 60) }") 
  
</template>

<style lang="postcss" scoped>

</style>