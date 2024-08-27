<script setup>
import { Gun, SEA } from '@gun-vue/gun-es'
import { computed, reactive, ref, watch } from 'vue';

const gun = Gun({ peers: ['https://peer.wallie.io/gun'] });

const appName = 'test13542'

const category = ref('')
const text = ref('')
const selected = ref('')

watch(selected, s => category.value = s)

const categories = reactive({});

const list = computed(() => categories['#' + selected.value] || [])

gun
  .get(appName)
  .map()
  .once(function (data, key) {
    categories[key] = categories[key] || []
    this.map().once((d, k) => {
      categories[key].push(d)
    })
  });

async function loadFromHash(category, hash) {
  if (
    category &&
    hash &&
    typeof hash == "string" &&
    hash.length == 44 &&
    hash.slice(0, 5) != "data:"
  ) {
    return await gun.get(appName).get(`#${category}`).get(hash).then();
  }
  return hash;
}


async function saveToHash(category, text) {
  if (category && text) {
    const hash = await hashText(text);
    gun.get(appName).get(`#${category}`).get(`${hash}`).put(text);
    return hash;
  } else {
    return text;
  }
}

async function hashText(text) {
  let hash = await SEA.work(text, null, null, { name: "SHA-256" });
  return hash;
}
</script>

<template lang='pug'>
.flex.flex-col.p-2.gap-2
  .text-2xl GUN P2P
  .flex.flex-wrap.gap-0
    button.text-button.flex-1.relative(
      :class="{ active: selected == c.slice(1) }"
      @click="selected = c.slice(1)"
      v-for="(cat, c) in categories" :key="cat") {{ c }} 
      .rounded-full.w-5.h-5.absolute.right-0.top-0.bg-gray-600 {{ Object.keys(cat).length }}


  .flex.flex-col.gap-2.items-start.max-w-45ch 
    .p-1.flex-1(
      v-for="(post, p) in list" :key="post") {{ post }}


  .flex.flex-col.max-w-45ch.rounded-xl.is-group.p-2.gap-2 
    input.p-2.rounded(v-model="category")
    textarea.p-2.rounded(v-model="text")
    button.text-button(@click="saveToHash(category, text); text = ''") Add
</template>