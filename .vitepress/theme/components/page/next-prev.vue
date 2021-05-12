<template lang="pug">
.next-and-prev-link(v-if="hasLinks")
  .row
    .prev
      a.link(v-if="prev", :href="$withBase(prev.link)")
        carbon-arrow-left.icon.icon-prev
        span.text {{ prev.text }}
    .next
      a.link(v-if="next", :href="$withBase(next.link)")
        span.text {{ next.text }}
        carbon-arrow-right.icon.icon-next          
</template>

<script setup lang="ts">
import { useNextAndPrevLinks } from '@composables/nextAndPrevLinks'

const { hasLinks, prev, next } = useNextAndPrevLinks()
</script>

<style scoped>
.next-and-prev-link {
  @apply bg-gray-100 mt-16 dark:bg-gray-800;
}

.row {
  @apply mx-auto flex w-full max-w-65ch;
}

.prev,
.next {
  display: flex;
  flex: 1;
  flex-shrink: 0;
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
  @apply flex p-8 text-2xl bg-gray-100 dark:bg-gray-800;
  display: inline-flex;
  align-items: center;
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
