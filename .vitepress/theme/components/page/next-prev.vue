<template lang="pug">
.next-and-prev-link
  .row
    .pad.prev(v-if="prev")
      a.link( :href="$withBase(prev.link)")
        carbon-arrow-left.icon.icon-prev
        span.text {{ prev.text }}
    page-parents.pad.text-2xl.flex-1.flex.flex-col.items-center.p-8
    .pad.next(v-if="next")
      a.link( :href="$withBase(next.link)")
        span.text {{ next.text }}
        carbon-arrow-right.icon.icon-next          
</template>

<script setup lang="ts">
import { useNextAndPrevLinks } from '@theme/composables/nextAndPrevLinks'

const { hasLinks, prev, next } = useNextAndPrevLinks()
</script>

<style scoped>
.next-and-prev-link {
  @apply bg-gray-100 dark:bg-gray-800;
}

.row {
  @apply mx-auto flex flex-col w-full max-w-65ch xs:(flex-wrap flex-row);
}

.pad {
  @apply transition-all bg-light-300 dark:(bg-dark-300 hover:bg-dark-600) hover:bg-light-600;
  display: flex;
  flex: 1;
  flex-shrink: 0;
}
.pad:hover {
}

.prev {
  justify-content: flex-start;
  padding-right: 12px;
}

.next {
  justify-content: flex-end;
  padding-left: 12px;
}

.link {
  @apply flex items-center p-8 text-2xl;
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
  display: block;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--c-text);
  transform: translateY(1px);
}

.icon-prev {
  margin-right: 8px;
}
.icon-next {
  margin-left: 8px;
}
</style>
