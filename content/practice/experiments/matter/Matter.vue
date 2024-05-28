<script setup>
import { useMatter } from './useMatter.js';

const { canvas } = useMatter();
</script>

<template lang='pug'>
section.w-full.h-100svh(ref="canvas")
</template>
