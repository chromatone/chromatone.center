<template lang="pug">
.flex.p-4.flex-col.tile.border-t-16(:i="i", :total="total"
  :style="{ borderColor: lchToHsl(i, total) }",
)
  // img.cover(:src="'/media/' + item.data.cover")
  a.flex.flex-col.p-2(
    :href="item.link", 

    )
    .text-3xl.mb-4.font-bold {{ item.title }}
    .font-normal {{ item.subtitle }}
  .flex.flex-wrap.py-2
    a.cursor-pointer.m-2.shadow-md.rounded-xl.border-4(
      :style="{ borderColor: lchToHsl(p, theme.pages?.[item.data.list].length) }",
      :href="page.link",
      v-for="(page,p) in theme.pages?.[item.data.list]" :key="page.title"
      )
      .m-2.p-2(:i="p", :total="theme.pages?.[item.data.list].length") {{ page  .title }}
</template>

<script setup>
import { useData } from 'vitepress'
import { lchToHsl } from '@use/colors.js'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

const { theme } = useData();

const color = computed(() => lchToHsl(props.i, props.total));
</script>

<style scoped>
.tile {
  @apply bg-light-300 mx-2 sm_mx-4 shadow-lg dark_bg-dark-400 my-8 flex flex-col transition no-underline rounded-xl;

  flex: 1 1 50px;
  &:hover {
  }
}

.cover {
  @apply h-sm;
}
</style>