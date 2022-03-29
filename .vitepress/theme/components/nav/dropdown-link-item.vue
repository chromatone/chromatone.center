<script setup>
const props = defineProps(['item'])

</script>

<template lang="pug">
a.item(:href="item.path")
  span.inline-flex.items-center.font-normal {{ item.title }}
</template>

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
