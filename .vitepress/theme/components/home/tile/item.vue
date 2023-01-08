<script setup>
import { useData } from 'vitepress'
import { lchToHsl } from '#/use/colors.js'
import { pages } from '#/theme/composables/pages'

const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

const { theme } = useData();

const color = computed(() => lchToHsl(props.i, props.total));
</script>

<template lang="pug">
.flex.p-4.flex-col.tile.border-t-16(:i="i", :total="total"
  :style="{ borderColor: lchToHsl(i, total) }",
)
  // img.cover(:src="'/media/' + item.data.cover")
  a.flex.flex-col.p-2.no-underline(
    :href="item.path", 
    )
    .text-5xl.mb-4(
      :style="{ color: lchToHsl(i, total) }"
    ) {{ item.title }}
    .font-normal {{ item.subtitle }}
  .flex.flex-wrap.py-2
    a.cursor-pointer.m-2.shadow-md.rounded-xl.border-4.no-underline(
      :style="{ borderColor: lchToHsl(p, pages[item.path].length) }",
      :href="page.path",
      v-for="(page, p) in pages[item.path]" :key="page.path"
      )
      .m-2.p-2(:i="p", :total="pages[item.path].length") {{ page?.title }}
</template>

<style lang="postcss" scoped>
.tile {
  @apply bg-light-300 mx-2 sm-mx-4 shadow-lg dark-bg-dark-400 my-8 flex flex-col transition no-underline rounded-xl;

  flex: 1 1 50px;
}

.cover {
  @apply h-sm;
}
</style>