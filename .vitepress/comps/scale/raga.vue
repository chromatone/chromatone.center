<script setup>
import { globalScale } from '@use/chroma'
import { pitchColor } from '@use/calculations'
import melakarta from '@db/melakarta.json'

let mela = {}

for (let i = 0; i < 72; i++) {
  let raga = melakarta[i]
  mela[raga.category] = mela[raga.category] || {}
  mela[raga.category][raga.group] = mela[raga.category][raga.group] || {}
  mela[raga.category][raga.group][raga.num] = raga
}

const state = reactive({
  chroma: useStorage('degrees-chroma', '101011010100'),
  current: computed(() => Object.values(melakarta).find(raga => raga.chroma == state.chroma)),
  cat: 'Shuddha Madhyama',
  group: 'Indu Chakra',
});

watch(() => state.current, raga => {
  if (!raga) return
  state.cat = raga.category
  state.group = raga.group
});

</script>

<template lang="pug">
.flex.flex-col.items-center.max-w-55ch.mx-auto
  scale-degrees-circle.w-full(
    v-model:chroma="state.chroma"
    fixed5
  )
  .flex.flex-col.items-center(v-if="state.current")
    .text-2xl.font-bold {{ state.current.title }}
    .text-sm {{ state.current.telugu }}
    chroma-line(:chroma="state.chroma")
    .p-1 Arohana: {{ state.current.asc }}
    .p-1 Avarohana: {{ state.current.dec }} 

  .flex.flex-col.my-4
    .flex.flex-wrap.border-b-2.border-current.py-2
      .text-xl.m-2.cursor-pointer(
        v-for="(groups, cat) in mela" :key="cat"
        @click="state.cat = cat; state.group = Object.keys(mela[cat])[0]"
        :class="{ selected: state.cat == cat }"
      ) {{ cat }}
    .flex.flex-wrap.border-b-1.border-current.py-2
      .m-1.cursor-pointer(
        v-for="(group, g) in mela[state.cat]" :key="g"
        @click="state.group = g"
        :class="{ selected: state.group == g }"
        ) {{ g }}

    .p-1.flex.flex-wrap.cursor-pointer.border-1.border-transparent(v-for="raga in mela[state.cat][state.group]" :key="raga" @click="state.chroma = raga.chroma" :class="{ active: state.chroma == raga.chroma }") 
      .p-0.w-10rem.m-1 {{ raga.title }}
      .flex-1
      chroma-line(:chroma="raga.chroma")
</template>

<style lang="postcss" scoped>
.active {
  @apply border-current rounded-lg;
}
.selected {
  @apply font-bold underline underline-offset-4 underline-3;
}
</style>