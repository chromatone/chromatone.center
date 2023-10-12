<script setup>


</script>

<template lang="pug">
g.transport(font-size="45")
  g.btn.cursor-pointer(transform="translate(0,50)")
    rect.border(
      fill="transparent"
      stroke-width="4"
      rx="10"
      width="70"
      height="80"
    )
    g(transform="translate(6,12)")
      slot

</template>

<style lang="postcss" scoped>
.border {
  stroke: #3333;
  transition: stroke 200ms ease-out;
}

.btn:hover .border {
  stroke: currentColor;
}
</style>