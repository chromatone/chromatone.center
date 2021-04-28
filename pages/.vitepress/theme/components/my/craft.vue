<template lang="pug">
.my-6

  .flex.py-2.items-center

    .flex-1.text-lg {{ craft?.title }} {{ craft?.icon }} 

    .text-md.text-right {{ craft?.interest }}

  .flex.relative.bg-gray-100.rounded-full.items-center

    .flex-1.bg-lime-300.pl-2.rounded-full(:style="{ maxWidth: craft?.current / craft?.total * 100 + '%' }") &nbsp;

    .absolute.right-1em {{ craft?.current }} / {{ craft?.total }}

  .text-sm.m-2 {{ craft?.comment }}

  my-skill(v-for="skill in craft?.skills", :key="skill.title", :skill="skill")
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  craft: Object,
});
</script>

<style lang="postcss" scoped>
</style>