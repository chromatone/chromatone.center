<script setup>
import { lchToHsl } from "#/use/colors";
import { useData, useRoute } from "vitepress";
import { onMounted, watch } from "vue";
import SideBarLevel from "./SideBarLevel.vue";

const { site } = useData();

defineProps({
  open: { type: Boolean, required: true },
});

defineEmits(['close'])

const route = useRoute();

// onMounted(() => {
//   watch(() => route.data, d => {
//     const link = document.getElementById(d?.title)
//     if (!link) return
//     setTimeout(() => {
//       link.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//         inline: "start"
//       })
//     }, 150)

//   }, { immediate: true })
// })

</script>

<template lang="pug">
transition(name="fade")
  .sidebar-mask.z-50.overscroll-contain(v-show="open", @click="$emit('close')")
.panel.sticky.top-16(:class="{ open }")
  //- .-mt-4.ml-5.mb-4.text-xl.opacity-10.hover-opacity-80.transition
  //-   a.title.ml-10.no-underline(href="/", :aria-label="`${site.title}, go to main page`") Home
  SideBarLevel(path="/" :level="0")
  .flex-1
  a.opacity-20.p-4.mt-1.hover-opacity-80.flex.items-center.gap-2(href="/" v-if="route.path!='/'") 
    .i-la-home
    .p-0 Back to main
</template>

<style lang="postcss" scoped>
.panel {
  width: 16.4rem;
  flex: 0 0 16.4rem;
  overflow-y: auto;
  scroll-padding-top: 4em;
  transition: all 300ms ease-out;
  @apply min-w-30 max-h-100vh pr-2 pl-1 fixed top-0 bottom-0 left-0 transform -translate-x-full lg-(sticky translate-x-0) shadow-xl bg-light-600 dark-bg-dark-200 overscroll-contain z-51 scroll-ma-xl;
}

.panel a {
  @apply no-underline block flex;
}

.panel.open {
  @apply translate-x-0;
}

.level {
  @apply my-1 ml-1 cursor-pointer flex flex-col border-l-2 transition-all duration-200 ease-in-out hover-border-l-4;
}

.level>a {
  @apply py-2 flex px-2 font-normal;
}

.first {
  @apply text-xl;
}

[aria-current="page"] {
  @apply border-l-6 font-bold bg-light-100/50 dark-bg-dark-100/50 hover-border-l-6;
}

[aria-current="page"]>a {
  @apply font-bold py-4;
}
</style>
