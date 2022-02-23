<script setup lang="ts">
const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="sidebar-button text-xl" @click="emit('toggle')">
    <ri-menu-5-fill />
  </div>
</template>

<style>
.sidebar-button {
  @apply cursor-pointer h-full inline-flex px-2 items-center lg_hidden;
}
</style>
