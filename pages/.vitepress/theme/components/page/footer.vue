<template lang="pug">
footer.page-footer
  edit-link
  page-last-updated
</template>

<script setup lang="ts">

</script>

<style scoped lang="postcss">
.page-footer {
  @apply
    py-4 overflow-auto space-y-1
    lg:(flex space-between align-center space-y-0);
}
</style>
