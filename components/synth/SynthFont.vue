<script setup>
//https://danigb.github.io/smplr/
//https://github.com/danigb/smplr

import { useSoundFont } from '#/use';

const { getSoundfontNames, inst, cached, loaded, instrument, fontEnabled, active, volume } = useSoundFont()

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
</script>

<template lang='pug'>
.flex.flex-col.border.bg-light-900.dark-bg-dark-100.rounded-lg
  //- .flex.flex-wrap.gap-1.p-2.overflow-scroll.max-w-full.max-h-full
    button.transition.p-1.text-sm.cursor-pointer.border-1.border-dark-900.border-opacity-10.rounded.shadow.flex-auto.capitalize.dark-border-light-200.dark-border-opacity-20(
      v-for="name in getSoundfontNames()" :key="name"
      @click="instrument = name"
      :class="{ ['border-opacity-100 dark-border-opacity-90 filter filter-invert']: name == instrument, ['opacity-50']: name == instrument && !loaded, ['bg-light-100 dark-bg-dark-900']: !cached[name], ['bg-light-900 dark-bg-dark-100']: cached?.[name] }"
      ) {{ name.replaceAll('_', ' ') }}

  .flex.flex.gap-4.items-center.justify-start.p-1
    button.flex.text-lg.transition.text-button.items-center.justify-center(@click="fontEnabled = !fontEnabled"
      :class="{ 'active': fontEnabled }"
      )
      .i-la-spinner.animate-pulse(v-if="!loaded")
      .i-la-power-off(v-else)
      .p-2px.rounded-full.bg-current.absolute(:style="{ opacity: active ? 1 : 0 }")

    select.flex-1.min-w-2.p-1.bg-light-500.dark-bg-dark-500(v-model="instrument")
      option( v-for="name in getSoundfontNames()" :key="name" :value="name") {{ capitalize(name.replaceAll('_', ' ')) }} {{ cached[name] ? '✔' : '' }}


    .flex.text-lg
      .i-la-spinner.animate-pulse(v-if="!loaded")
      .i-la-check(v-else) Loaded!



    ControlRotary.scale-70.-m-5(v-model="volume" :max="1" :step="0.01" param="VOL")


</template>