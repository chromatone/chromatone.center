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
    //- page-parents.pad.text-2xl.flex-1.flex.flex-col.items-center.p-8
    card-box.pad.next(
      v-if="next"
      :i="current + 1"
      :total="total"
      :height="4"
      )
      a.link( :href="next.link" :style="{ color: colors.next }")
        span.text {{ next.title }}
        carbon-arrow-right.icon.icon-next          
</template>

<script setup lang="ts">
import { useSiblings } from '../../composables/links.js'
import { lchToHsl } from '@use/colors.js'

const { prev, next, current, total } = useSiblings()
const colors = {
  current: lchToHsl(current, total),
  prev: lchToHsl(current - 1, total),
  next: lchToHsl(current + 1, total)
}
</script>

<style scoped>
.next-and-prev-link {
  @apply bg-gray-100/90 dark:bg-gray-800/90 py-4 
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.row {
  @apply mx-auto flex flex-col w-full max-w-65ch my-8 xs:(flex-wrap flex-row);
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
