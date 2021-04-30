<template lang="pug">
.next-and-prev-link(v-if="hasLinks")
  .container.m-auto
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
  padding-top: 1rem;
  margin: auto;
}

.container {
  @apply flex mt-4 pt-8;
  justify-content: space-between;
  border-top: 1px solid var(--c-divider);
}

.prev,
.next {
  display: flex;
  flex-shrink: 0;
  width: 50%;
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
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  font-weight: 500;
}

.text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
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
