<script setup>
import { lchToHsl } from '#/use/colors'

const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { data } from '../../../content/pages.data'
import { cleanLink, useChildren } from '../../../theme/pages'

const children = useChildren({ path: props.item.url }, data)

</script>

<template lang="pug">
.tile.flex.p-4.pt-36.flex-col.bg-light-300.shadow-lg.hover-shadow-xl.dark-bg-dark-400.flex.flex-col.transition.no-underline.rounded-2xl.saturate-90.contrast-90.hover-saturate-100.hover-contrast-90.overflow-hidden.relative(
  :i="i", :total="total")

  .cover.absolute.left-0.top-0.right-0.bottom-0.transition.scale-105.cover.bg-center(
    :style="{ backgroundImage: ` url(${props.item?.frontmatter?.cover})` }",
    )
  //- img.cover(:src="'/media/' + item.data.cover")
  a.flex.flex-col.p-4.pb-4.no-underline.bg-light-100.rounded-lg.bg-op-80.dark-bg-dark-700.dark-bg-op-80.backdrop-blur.hover-bg-op-95.dark-text-light-100(
    :href="cleanLink(item.url)", 
    )
    .flex.items-center.gap-2.mb-4(
      )
      .text-3xl(style="flex: 0 1 30px") 
        .i-la-book(v-if="item?.frontmatter?.title == 'Theory'")
        .i-la-hand-point-up(v-if="item?.frontmatter?.title == 'Practice'")
        .i-la-chalkboard-teacher(v-if="item?.frontmatter?.title == 'Academy'")
        .i-la-shopping-bag(v-if="item?.frontmatter?.title == 'Shop'")
        .i-la-star(v-if="item?.frontmatter?.title == 'Support'")
        .i-la-at(v-if="item?.frontmatter?.title == 'Contacts'")
        .i-la-chalkboard-teacher(v-if="item?.frontmatter?.title == 'Tutorship'")
      .text-3xl.font-bold.underline.underline-4(
        :style="{ textDecorationColor: lchToHsl(i, total) }"
      ) {{ item?.frontmatter?.title }}
    .font-normal.mb-1 {{ item?.frontmatter?.description }}
  .flex.flex-wrap.py-3.gap-2(v-if="children?.length > 0")
    a.cursor-pointer.backdrop-blur.shadow-sm.rounded-lg.hover-shadow-lg.dark-bg-op-70.dark-bg-dark-900.bg-light-100.bg-op-80.transition.no-underline.hover-bg-op-95.hover-dark-op-95.dark-text-light-100(
      :style="{ textDecorationColor: lchToHsl(p, children.length), textDecorationThickness: '.25em' }",
      :href="cleanLink(page.url)",
      v-for="(page, p) in children" :key="page.url"
      )
      .m-3.mb-4.font-bold(:i="p", :total="children.length") {{ page?.frontmatter?.title }}
</template>

<style lang="postcss" scoped>
.cover {
  @apply saturate-50 contrast-50 transition-800 blur-sm brightness-140 dark-brightness-80
}

.tile:hover .cover {
  @apply saturate-80 contrast-70 blur-1px brightness-100
}
</style>