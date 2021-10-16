<template lang="pug">
button.text-button.text-2xl(
  v-show="supported"
  @click="toggle()"
)
  la-expand
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const props = defineProps(['el'])

const element = ref()

onMounted(() => {
  nextTick(() => {
    if (props.el) {
      element.value = props.el
    } else {
      element.value = document.getElementById('screen')
    }
    full.value = useFullscreen(element.value)
  })


})

const full = ref()

function toggle() {
  if (!full.value) full.value = useFullscreen(element.value);
  full.value.toggle()
}

const supported = computed(() => full.value?.isSupported);

</script>

<style scoped>
</style>