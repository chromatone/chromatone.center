<template>
  <a class="item" v-bind="linkProps">
    <!-- <span class="arrow" /> -->
    <span class="inline-flex items-center font-normal">{{ item.text }}</span>
    <!-- <span class="icon"><OutboundLink v-if="isExternal" /></span> -->
  </a>
</template>

<script setup>
import { toRefs } from 'vue'

import { useNavLink } from '../../composables/navLink.js'

const props = defineProps(['item'])

const propsRefs = toRefs(props)

const { props: linkProps } = useNavLink(propsRefs.item);
</script>

<style scoped >
.item {
  @apply block px-6 py-2 text-$c-text whitespace-nowrap text-0.95rem
  md_(px-4 py-2 text-sm);
}

@screen lg {
  .item.active .arrow {
    opacity: 1;
  }
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

@screen md {
  .arrow {
    display: inline-block;
    margin-right: 8px;
    border-top: 6px solid #ccc;
    border-right: 4px solid transparent;
    border-bottom: 0;
    border-left: 4px solid transparent;
    vertical-align: middle;
    opacity: 0;
    transform: translateY(-2px) rotate(-90deg);
  }
}
</style>
