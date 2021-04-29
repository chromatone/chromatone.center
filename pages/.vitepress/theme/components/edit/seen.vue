<template lang="pug">
.flex(@click="setSeen()") 
  la-check(v-if="dif > 0",:style="{ color: dif > 0 ? 'green' : 'gray' }")
  card-date(v-else,:date="modified")
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useLocalStorage, useToggle } from '@vueuse/core'

const props = defineProps({
  title: String,
  modified: String,
  content: Boolean,
})

const seen = useLocalStorage(props.title, props.content ? Date.now() : 0)

function setSeen() {
  seen.value = Date.now()
}

const dif = computed(() => {
  let mod = new Date(props.modified).getTime()
  let dif = seen.value - mod
  return dif
});

</script>

<style  scoped>
</style>