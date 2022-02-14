<template>
  <div class="nav-link">
    <a class="item" v-bind="linkProps">{{ item.text }}</a>
  </div>
</template>

<script setup >
import { toRefs } from 'vue'
import { useNavLink } from '../../composables/navLink.js'

const props = defineProps(['item'])

const propsRefs = toRefs(props)

const { props: linkProps } = useNavLink(propsRefs.item);
</script>

<style scoped >
.item {
  @apply block border-0 px-3 py-1.5 w-full
    text-left font-$font-family-base font-semibold text-$c-text whitespace-nowrap bg-transparent cursor-pointer
    lg_(border-b-2px border-transparent px-0 font-normal text-0.9rem);
}

.item:hover,
.item.active {
  text-decoration: none;
  color: var(--c-brand);
}

.item.external:hover {
  border-bottom-color: transparent;
  color: var(--c-text);
}

@screen lg {
  .item:hover,
  .item.active {
    border-bottom-color: var(--c-brand);
    color: var(--c-text);
  }
}
</style>
