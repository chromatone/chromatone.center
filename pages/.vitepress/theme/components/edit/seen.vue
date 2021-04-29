<template lang="pug">
.flex(@click="toggleSeen()")
  fa-eye(v-if="!seen")
  fa-eye-slash(v-else)
</template>

<script setup>
import { defineProps } from 'vue'
import { useStorage, useToggle } from '@vueuse/core'

const props = defineProps({
  link: String,
})

const seen = useStorage(props.link, false)

const toggleSeen = useToggle(seen);
</script>

<style  scoped>
</style>