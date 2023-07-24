<script setup>
import { lchToHsl } from '#/use/'
import { computed, reactive } from 'vue';
import { cleanLink } from 'vitepress-pages'

const props = defineProps(['parents', 'siblings'])

const colors = reactive({
  current: computed(() => lchToHsl(props.siblings.index, props.siblings.total)),
  prev: computed(() => lchToHsl(props.siblings.index - 1, props.siblings.total)),
  next: computed(() => lchToHsl(props.siblings.index + 1, props.siblings.total))
});
</script>

<template lang="pug">
.next-and-prev-link
  .row(:style="{ borderColor: colors.current }")
    .pad.prev(v-if="siblings.prev")
      a.link( 
        :href="cleanLink(siblings.prev.url)" :style="{ backgroundColor: colors.prev }")
        .i-carbon-arrow-left.icon.icon-prev
        span.text {{ siblings.prev?.frontmatter?.title }}

    .pad.next(v-if="siblings.next")
      a.link( :href="cleanLink(siblings.next.url)" :style="{ backgroundColor: colors.next }")
        span.text {{ siblings.next?.frontmatter?.title }}
        .i-carbon-arrow-right.icon.icon-next     
  .flex.flex-col.items-justify
    .flex.flex-col.items-justify.mx-4
      a.parent(
        style="flex:1 1"
        v-for="(parent, p) in [...parents].slice(1,-1)" :key="parent"
        :href="cleanLink(parent.url)"
        :style="{ order: 100 - p }"
        )
        .i-carbon-chevron-up.mr-1
        .p-1 {{ parent?.frontmatter?.title }}
  nav-row
</template>

<style lang="postcss" scoped>
.next-and-prev-link {
  @apply bg-dark-50/10 dark-bg-dark-800/90;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.next-and-prev-link a {
  @apply text-dark-800 dark-text-light-300;
}

.parent {
  @apply p-4 flex items-center justify-center m-2 rounded-xl shadow-md transition-all duration-100 ease-out bg-light-400/40 dark-bg-dark-300/10 hover-no-underline hover-(bg-light-100/60 shadow-lg) dark-(hover-bg-dark-300);
}

.row {
  @apply mx-auto border-t-12 flex flex-col w-full py-4 px-4 md-(flex-wrap flex-row);
}

.pad {
  @apply transition-all duration-200 ease-out m-2 rounded-xl shadow-lg hover-shadow-xl transition-all flex flex-row items-stretch;
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
  @apply items-center no-underline w-full rounded-xl p-8 text-2xl max-w-88vw;
  font-weight: 500;
}

.text {
  @apply font-bold;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  display: inline;
  width: 1.5rem;
  height: 1.5rem;
  padding: 1rem;
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
