<template lang="pug">
.flex.flex-wrap.mb-4.text-lg
  .flex-1(v-for="page in getParents($frontmatter.tags, $site.customData.pages.all)", :key="page.title") 
    a(:href="page.link") {{ page.title }}
</template>

<script setup>
function getParents(tag, all) {
  let parents = [];
  all.forEach(page => {
    if (tag && typeof tag == 'string' && tag == page.data?.list) {
      parents.push(page)
    }
  })
  return parents
}
</script>

<style lang="stylus" scoped>

</style>