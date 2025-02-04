<script setup>
import { data } from './projects.data'

</script>

<template lang='pug'>
.text-xl.flex.items-center.p-4.gap-2(style="flex: 1 0 100%")
  .font-bold Projects
  .op-80 {{ data.length }}
slot 
.flex.flex-wrap.gap-4.p-4
  a.items-stretch.bg-light-800.dark-bg-dark-200.no-underline.rounded.overflow-hidden.shadow.hover-brightness-110.flex.flex-wrap(
    style="flex: 1 1 400px"
    :href="`/projects/${project?.slug}/`"
    v-for="project in data" :key="project"
    ) 
    .p-0(style="flex: 1 1 180px")
      img( :src="`/cover/${project?.slug}.webp`")
    .flex.flex-col.gap-2.p-4(style="flex: 1 1 250px")
      .p-0.flex.flex-col.gap-2
        .text-sm.flex.flex-wrap.gap-1
          .op-60 {{ project?.start_date }} − {{ project?.end_date || 'Present' }}
          .flex-1

        .text-2xl.font-bold {{ project?.title }}

        .text-md.op-80.leading-7 {{ project?.description }}
      .flex-1
      //- .text-md.op-40.bg-dark-300.bg-op-40.flex.items-center(v-if="project?.events.length") Events: {{ project?.events.length }}

       
</template>