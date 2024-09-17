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
import { cleanLink, useChildren } from '../../../theme/pages'

const route = useRoute();
const children = useChildren({ path: props.item.url }, data)

const color = computed(() => lchToHsl(props.i, props.total));
</script>

<template lang="pug">
.flex.p-4.flex-col.tile.border-2(
  :i="i", :total="total"
  :style="{ borderColor: lchToHsl(i, total) }",
)
  // img.cover(:src="'/media/' + item.data.cover")
  a.flex.flex-col.p-2.no-underline(
    :href="cleanLink(item.url)", 
    )
    .flex.items-start.gap-2.mb-4(
      :style="{ color: lchToHsl(i, total) }"
      )
      .text-4xl(style="flex: 0 1 30px")
        .i-la-book(v-if="item?.frontmatter?.title == 'Theory'")
        .i-la-hand-point-up(v-if="item?.frontmatter?.title == 'Practice'")
        .i-la-chalkboard-teacher(v-if="item?.frontmatter?.title == 'Academy'")
        .i-la-shopping-bag(v-if="item?.frontmatter?.title == 'Shop'")
        .i-la-star(v-if="item?.frontmatter?.title == 'Support'")
        .i-la-at(v-if="item?.frontmatter?.title == 'Contacts'")
        .i-la-chalkboard-teacher(v-if="item?.frontmatter?.title == 'Tutorship'")
      .p-0.flex.flex-col.gap-2.flex-1
        .text-4xl.font-bold.underline.underline-4 {{ item?.frontmatter?.title }}
    .font-normal {{ item?.frontmatter?.description }}
  .flex.flex-wrap.py-2.gap-2.mt-2(v-if="children?.length>0")
    a.cursor-pointer.shadow-md.rounded.border-1.no-underline.hover-shadow-lg.dark-bg-dark-700.bg-light-100(

      :style="{ borderColor: lchToHsl(p, children.length) }",
      :href="cleanLink(page.url)",
      v-for="(page, p) in children" :key="page.url"
      )
      .m-2(:i="p", :total="children.length") {{ page?.frontmatter?.title }}
</template>

<style lang="postcss" scoped>
.tile {
  @apply bg-light-300 shadow-lg hover-shadow-xl dark-bg-dark-400 flex flex-col transition no-underline rounded-lg;
}

.cover {
  @apply h-sm;
}
</style>