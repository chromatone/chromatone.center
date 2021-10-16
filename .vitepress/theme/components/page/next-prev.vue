<template lang="pug">
.next-and-prev-link(:style="{ backgroundColor: colors.current }")
  .row
    card-box.pad.prev(
      v-if="prev" 
      :i="current - 1"
      :total="total"
      :height="4"
      )
      a.link( :href="prev.link" :style="{ color: colors.prev }")
        carbon-arrow-left.icon.icon-prev
        span.text {{ prev.title }}

    card-box.pad.next(
      v-if="next"
      :i="current + 1"
      :total="total"
      :height="4"
      )
      a.link( :href="next.link" :style="{ color: colors.next }")
        span.text {{ next.title }}
        carbon-arrow-right.icon.icon-next     
  .flex.flex-col.items-justify.p-4(
    class="bg-light-900 dark:bg-dark-700"
  )
    .flex.flex-col.items-justify
      a.p-4.flex.items-center.justify-center.m-2.rounded-xl.shadow-lg.transition-all.duration-300.ease-out(
        style="flex:1 1"
        class="hover:bg-light-100/50 dark:(hover:bg-dark-100/50)"
        v-for="(parent,p) in parents" :key="parent"
        :href="parent.link"
        :style="{ order: 100 - p }"
        )
        carbon-chevron-up.mr-1
        .p-1 {{ parent.title }}
    a.text-xl.p-4.flex.flex-col.items-center(href="/")
      img.w-16(:src="theme.logo")
      .p-2 Chromatone
</template>

<script setup lang="ts">
import { useSiblings, useParents } from '../../composables/links.js'
import { lchToHsl } from '@use/colors.js'
import { useRoute, useData } from 'vitepress'
const { theme } = useData()

const { prev, next, current, total } = useSiblings();
const parents = useParents();
const colors = {
  current: lchToHsl(current, total),
  prev: lchToHsl(current - 1, total),
  next: lchToHsl(current + 1, total)
}
</script>

<style scoped>
.next-and-prev-link {
  @apply bg-gray-100/90 dark:bg-gray-800/90 
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.row {
  @apply mx-auto  flex flex-col w-full max-w-65ch my-8 px-4 xs:(flex-wrap flex-row);
}

.pad {
  @apply m-2 transition-all flex flex-row items-stretch bg-light-300 dark:(bg-dark-300 hover:bg-dark-600) hover:bg-light-600;
  flex: 1 1 45%;
  filter: grayscale(40%) opacity(80%);
}
.pad:hover {
  filter: grayscale(0%) opacity(100%);
}

.prev {
  justify-content: flex-start;
}

.next {
  justify-content: flex-end;
  text-align: right;
}

.link {
  @apply items-center no-underline w-full rounded-sm p-8 text-2xl;
  max-width: 100%;
  font-weight: 500;
}

.text {
  @apply font-bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  display: inline;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--c-text);
  transform: translateY(-2px);
}

.icon-prev {
  margin-right: 8px;
}
.icon-next {
  margin-left: 8px;
}
</style>
