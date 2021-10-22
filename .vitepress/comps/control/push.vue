<template lang="pug">
.btn(
  :class="{ active: modelValue }"
  @mousedown.self="setValue(true)"
  @mouseup.self="setValue(false)"
  @touchstart.self="setValue(true)"
  @touchend.self="setValue(true)"
  @touchcancel.self="setValue(false)"
) 
  .mb-5(
    @mousedown.self="setValue(true)"
    @mouseup.self="setValue(false)"
    @touchstart.self="setValue(true)"
    @touchend.self="setValue(true)"
    @touchcancel.self="setValue(false)"
    ) {{ title }}
  .toggle(
    @click.stop.capture="setValue(!modelValue)"
  )
    .toggler
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'BTN'
  }
});

const emit = defineEmits(['update:modelValue'])

function setValue(val) {
  emit('update:modelValue', val)
}


</script>

<style scoped>
.btn {
  @apply p-2 border-2 text-center flex flex-col place-items-center rounded-lg m-1 select-none cursor-pointer relative border-dark-100/50 dark:(border-light-100/50);
}
.btn.active {
  @apply transition-all duration-200 bg-dark-100/50 dark:(bg-light-100/50);
}
.toggle {
  @apply relative h-20px border-1 absolute bottom-1 border-dark-100/50 dark:(border-light-100/50) left-1 right-1 rounded-10px;
}
.toggler {
  @apply transition-all duration-300 absolute  left-0 rounded-10px w-18px h-18px bg-dark-100/50 dark:(bg-light-100/50 );
}
.active .toggle {
  @apply bg-dark-100/30 dark:(bg-light-100/30);
}
.active .toggler {
  @apply right-0 left-auto mix-blend-difference;
}
</style>