<script setup>
import { lchToHsl } from '#/use/'
import { computed, reactive } from 'vue';
import { cleanLink } from '../../../pages/index'

const props = defineProps(['parents', 'siblings'])

const colors = reactive({
  current: computed(() => lchToHsl(props.siblings.index, props.siblings.total, 0.9, 20, 50)),
  prev: computed(() => lchToHsl(props.siblings.index - 1, props.siblings.total, 0.8, 20, 50)),
  next: computed(() => lchToHsl(props.siblings.index + 1, props.siblings.total, 0.8, 20, 50))
});
</script>

<template lang="pug">
.next-and-prev-link
  .row(:style="{ borderColor: colors.current }")
    a.pad.prev(
      v-if="siblings.prev" 
      :href="cleanLink(siblings.prev.url)"
      :style="{ backgroundColor: colors.prev, backgroundImage: `url(${siblings.prev?.frontmatter?.cover})` }"
      )
      .link( )
        .i-carbon-arrow-left.icon.icon-prev
        span.text {{ siblings.prev?.frontmatter?.title }}

    a.pad.next(
      v-if="siblings.next"
      :href="cleanLink(siblings.next.url)"
      :style="{ backgroundColor: colors.next, backgroundImage: `url(${siblings.next?.frontmatter?.cover})` }"
      )
      .link(  )
        span.text {{ siblings.next?.frontmatter?.title }}
        .i-carbon-arrow-right.icon.icon-next     
  .flex.flex-col.items-justify
    .flex.flex-col.items-justify.mx-4
      a.pad(
        style="flex:1 1"
        v-for="(parent, p) in [...parents].slice(1,-1)" :key="parent"
        :href="cleanLink(parent.url)"
        :style="{ order: 100 - p,backgroundColor: colors.next, backgroundImage: `url(${parent?.frontmatter?.cover})` }"
        )
        .link
          .i-carbon-arrow-up.mr-1
          .text {{ parent?.frontmatter?.title }}
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
  @apply p-4 flex items-center justify-start m-2 rounded-xl shadow-md transition-all duration-100 ease-out bg-light-400/40 dark-bg-dark-300/10 no-underline hover-(bg-light-100/60 shadow-lg) dark-(hover-bg-dark-300);
}

.row {
  @apply mx-auto border-t-8 mt-20 flex flex-col w-full py-4 px-4 md-(flex-wrap flex-row);
}

.pad {
  @apply no-underline bg-cover bg-center p-4 pt-24 transition-all duration-200 ease-out m-2 rounded-xl shadow-lg hover-shadow-xl transition-all;
  flex: 1 1 45%;
  filter: grayscale(50%) opacity(50%) contrast(80%);
}

.pad:hover {
  filter: grayscale(0%) opacity(100%) contrast(100%);
}

.prev {
  justify-content: flex-start;
}

.next {
  justify-content: flex-end;
  text-align: right;
  float: right;
}

.link {
  @apply p-4 flex items-center no-underline w-full rounded-lg text-xl max-w-88vw backdrop-blur-sm bg-light-200 bg-opacity-70 dark-bg-dark-700 dark-bg-opacity-60;
  font-weight: 500;
  max-width: fit-content
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
