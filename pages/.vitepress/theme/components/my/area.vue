<template lang="pug">
.my-8 
  my-craft(v-for="craft in area?.crafts", :key="craft.title", :craft="craft")
</template>

<script  setup>
const props = defineProps({
  area: Object,
});

</script>

<style lang="postcss" scoped>
</style>