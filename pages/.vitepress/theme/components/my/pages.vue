<template lang="pug">
.flex.flex-col
  .flex(v-for="page in $site.customData.pages", :key="page.url") 
    a.text-lg(:href="'pages/'+page.url") {{ page.data.title }}
</template>

<script setup>

</script>

<style lang="stylus" scoped>

</style>