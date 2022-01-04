<template lang="pug">
.next-and-prev-link
  .row(:style="{ borderColor: colors.current }")
    .pad.prev(
      v-if="prev" 
      )
      a.link( :href="prev.link" :style="{ backgroundColor: colors.prev }")
        carbon-arrow-left.icon.icon-prev
        span.text {{ prev.title }}

    .pad.next(
      v-if="next"

      )
      a.link( :href="next.link" :style="{ backgroundColor: colors.next }")
        span.text {{ next.title }}
        carbon-arrow-right.icon.icon-next     
  .flex.flex-col.items-justify
    .flex.flex-col.items-justify.mx-4
      a.p-4.flex.items-center.justify-center.m-2.rounded-xl.shadow-md.transition-all.duration-100.ease-out(
        style="flex:1 1"
        class="bg-light-900/40 dark:bg-dark-300/10 hover:no-underline hover:(bg-light-900/30 shadow-lg) dark:(hover:bg-dark-700)"
        v-for="(parent,p) in parents" :key="parent"
        :href="parent.link"
        :style="{ order: 100 - p }"
        )
        carbon-chevron-up.mr-1
        .p-1 {{ parent.title }}
    a.text-xl.p-4.flex.flex-col.items-center(
      class="hover:no-underline"
      href="/"
      )
      img.w-32(src="/media/logo/circle.svg")
      .p-2 Chromatone
</template>

<script setup>
import { useSiblings, useParents } from '../../composables/links.js'
import { lchToHsl } from '@use/colors.js'
import { useRoute, useData } from 'vitepress'
const { theme } = useData()

const { prev, next, current, total } = useSiblings();
const parents = useParents();
const colors = reactive({
  current: computed(() => lchToHsl(current.value, total.value)),
  prev: computed(() => lchToHsl(current.value - 1, total.value)),
  next: computed(() => lchToHsl(current.value + 1, total.value))
});
</script>

<style scoped>
.next-and-prev-link {
  @apply bg-gray-100/90 dark:bg-gray-800/90 
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  & a {
    @apply text-dark-800 dark:text-light-300;
  }
}

.row {
  @apply mx-auto border-t-12  flex flex-col w-full py-4 px-4 xs:(flex-wrap flex-row);
}

.pad {
  @apply transition-all duration-200 ease-out m-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-row items-stretch;
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
  @apply items-center no-underline w-full rounded-xl p-8 text-2xl;
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
