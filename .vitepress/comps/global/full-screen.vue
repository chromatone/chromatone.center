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

const full = ref()

watchEffect(() => {
  full.value = useFullscreen(props.el);
})

function toggle() {
  if (!full.value) full.value = useFullscreen(props.el);
  full.value.toggle()
}

const supported = computed(() => full.value?.isSupported);

</script>

<style scoped>
</style>