<script setup>
const props = defineProps({
  modelValue: { type: String, default: 'sawtooth8' },
  types: {
    type: Object,
    default: {
      sine: 'SIN',
      triangle: 'TRI',
      square8: 'SQR',
      sawtooth8: 'SAW',
    }
  }
})

const emit = defineEmits(['update:modelValue'])


</script>

<template lang='pug'>
.flex.flex-wrap.justify-center.max-w-max
  .flex-auto.w-full.text-sm.text-center.border-b-1.border-dark-300.dark_border-light-300 OSC
  .flex.relative.flex-auto(v-for="(abbr, type) in types" :key="type")
    input.absolute.right-1.top-1(
      type="radio" v-model="modelValue" 
      @input="$emit('update:modelValue', type)"
      :id="type"
      :value="type"
      name="OSC" 
      :aria-label="`Select ${type} oscillator`"
      )
    label.text-button.flex-auto.flex.justify-center(
      :for="type" 
      :value="type"
      :class="{ active: modelValue == type }"
    )
      ph-wave-sine-duotone(v-if="type == 'sine'")
      ph-wave-triangle-duotone(v-if="type == 'triangle'")
      ph-wave-square-duotone(v-if="type == 'square8'")
      ph-wave-sawtooth-duotone(v-if="type == 'sawtooth8'")
</template>