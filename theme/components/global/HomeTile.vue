<script setup>
import { lchToHsl } from '#/use/colors'
import { computed } from 'vue';

const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, useChildren } from '../../../pages/index'

const route = useRoute();
const children = useChildren({ path: props.item.url }, data)

const color = computed(() => lchToHsl(props.i, props.total));
</script>

<template lang="pug">
.flex.p-4.flex-col.tile.border-l-12(:i="i", :total="total"
  :style="{ borderColor: lchToHsl(i, total) }",
)
  // img.cover(:src="'/media/' + item.data.cover")
  a.flex.flex-col.p-2.no-underline(
    :href="cleanLink(item.url)", 
    )
    .text-4xl.mb-4(
      :style="{ color: lchToHsl(i, total) }"
    ) {{ item?.frontmatter?.title }}
    .font-normal {{ item?.frontmatter?.description }}
  .flex.flex-wrap.py-2
    a.cursor-pointer.m-2.shadow-md.rounded.border-l-8.no-underline.hover-shadow-lg(
      :style="{ borderColor: lchToHsl(p, children.length) }",
      :href="cleanLink(page.url)",
      v-for="(page, p) in children" :key="page.url"
      )
      .m-2.p-1(:i="p", :total="children.length") {{ page?.frontmatter?.title }}
</template>

<style lang="postcss" scoped>
.tile {
  @apply bg-light-300 mx-2 sm-mx-4 shadow-lg hover-shadow-xl dark-bg-dark-400 my-8 flex flex-col transition no-underline rounded-lg;

  flex: 1 1 50px;
}

.cover {
  @apply h-sm;
}
</style>