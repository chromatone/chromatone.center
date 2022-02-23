<script setup>
const props = defineProps({
  text: { type: String, default: 'Text-to-speech' }
});

let utterance

onMounted(() => {
  utterance = new SpeechSynthesisUtterance(props.text);
})

function speak() {
  speechSynthesis.speak(utterance);
}

</script>

<template lang="pug">
span(@click="speak()") {{ text }}
</template>

<style scoped>
</style>