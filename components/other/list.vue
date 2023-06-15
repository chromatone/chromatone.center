<script setup>
const props = defineProps({
  tools: Object
});
</script>

<template lang="pug">
.flex.flex-col.max-w-60ch.m-auto
  .flex.flex-col.p-8.shadow.mb-4(v-for="tool in tools")
    a.flex.flex-col.py-2(:href="tool.url", target="_blank") 
      .text-xl.mr-2 {{ tool.title }}
      .opacity-80.font-normal.underline {{ tool.url }}
    .text-md {{ tool.description }}
</template>

<style lang="postcss" scoped></style>