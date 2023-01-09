<script setup >
import { useRoute } from 'vitepress'
import { pages } from '#/theme/composables/pages'

defineProps(['item'])

const route = useRoute()

const open = ref(false)

watch(
  () => route.path,
  () => {
    open.value = false
  },
)

function toggle() {
  open.value = !open.value
}
</script>

<template lang="pug">
.nav-dropdown-link(:class="{ open }")
  button.button(:aria-label="item.title", @click="toggle")
    a.button-text.no-underline(:href="item?.path") {{ item.title }}
    span.button-arrow(:class="open ? 'down' : 'right'").


  ul.dialog
    li.dialog-item(v-for="item in pages[item.path]", :key="item.text")
      nav-dropdown-link-item(:item="item")
        
        
</template>

<style scoped lang="postcss">
.nav-dropdown-link {
  @apply relative h-36px overflow-hidden cursor-pointer lg-(h-auto overflow-visible);
}

@screen lg {
  .nav-dropdown-link:hover .dialog {
    display: block;
  }
}

.nav-dropdown-link.open {
  height: auto;
}

.button {
  @apply block border-0 px-3 py-1.5 w-full text-left font-$font-family-base font-semibold text-$c-text whitespace-nowrap bg-transparent cursor-pointer lg-(border-b-2px border-transparent px-0 py-5 font-normal text-0.9rem);
}

.button:focus {
  outline: 0;
}

.button-arrow {
  display: inline-block;
  margin-top: -1px;
  margin-left: 8px;
  border-top: 6px solid #ccc;
  border-right: 4px solid transparent;
  border-bottom: 0;
  border-left: 4px solid transparent;
  vertical-align: middle;
}

.button-arrow.right {
  transform: rotate(-90deg);
}

@screen lg {
  .button-arrow.right {
    transform: rotate(0);
  }
}

.dialog {
  @apply m-0 p-0 mb-2 list-none z-8;
}

@screen lg {
  .dialog {
    right: -8px;
    box-shadow: var(--shadow-3);
    @apply hidden absolute top-48px rounded-md py-1.5 min-w-128px bg-$c-bg;
  }
}
</style>
