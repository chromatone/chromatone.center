<script setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(["update:open"]);

const panel = ref();

onClickOutside(panel, (ev) => {
  emit("update:open", false);
});
</script>

<template lang="pug">
transition(name="fade")
  .fixed.right-2.top-18.bg-light-200.dark-bg-dark-400.shadow-xl.rounded-2xl.max-w-95vw.w-120.p-4.flex.flex-wrap.gap-1(v-show="open" ref="panel")
    slot
</template>
