<script setup>
import { midi, midiColor, notes, playNoteOnce } from '#/use';
import { Gun, SEA } from '@gun-vue/gun-es'
import { gunAvatar } from 'gun-avatar'
import { computed, onMounted, reactive, ref, shallowReactive, watch } from 'vue';

const gun = Gun({ peers: ['https://peer.wallie.io/gun'] });

const appName = `test-app-1000`

const userPub = ref('')
const name = ref('')

watch(name, n => {
  gun.user().get('name').put(n)
})

watch(() => midi.note, note => {
  gun.user().get('midi').put(note.number)
})

gun.on("auth", () => {
  userPub.value = gun.user().is?.pub
  gun.user().get('name').on(n => {
    name.value = n
  })
  setInterval(() => gun.get(appName).get('users').get(userPub.value).put(Date.now()), 1000)
});

const pair = ref(null)
const pairAvatar = computed(() => gunAvatar({ pub: pair.value?.pub }))
const userAvatar = computed(() => gunAvatar({ pub: userPub.value }))

onMounted(() => {
  gun.user().recall({ sessionStorage: true });
  generate()
})

async function generate() {
  pair.value = await SEA.pair()
}

async function enter() {
  gun.user().auth(pair.value);
}

async function leave() {
  gun.user().leave();
  setTimeout(() => {
    if (!gun.user()?.is) {
      userPub.value = null
    }
  }, 500);
}

const users = shallowReactive({})

gun.get(appName).get('users').map().on((d, k) => {
  if (Date.now() - d < 5000)
    users[k] = { timestamp: d }
})

watch(users, () => {
  for (let pub in users) {
    gun.user(pub).get('name').once(d => users[pub].name = d)
    gun.user(pub).get('midi').once(d => users[pub].midi = d)
  }
})

gun.get(appName).get('play').on(p => {
  playNoteOnce(midi.note.number)
})

function play() {
  gun.get(appName).get('play').put(Date.now())
}

</script>

<template lang='pug'>
.flex.flex-col.p-2.gap-2
  .text-2xl GUN P2P
    button.text-button(@click="play()") Play

  .flex.p-2.items-center.flex-wrap(v-if="userPub")
    img(style="width:60px" :src="userAvatar")
    input(v-model="name")
    button.text-button(@click="leave()") Leave
  .flex.p-2.items-center.flex-wrap(v-else)
    button.text-button(@click="generate()") Generate
    img(style="width:60px" :src="pairAvatar")
    button.text-button(@click="enter()") Enter
  .flex.flex-wrap.items-center.gap-2
    .p-2.flex.flex-col.shadow.gap-2.relative(
      v-for="(user, us) in users" :key="user.name")
      img(style="width:60px; margin: 0" :src="gunAvatar({ pub: us })")
      .text-xs {{ user.name }} 
      .absolute.bottom-0.right-0.px-1.p-0.rounded-xl.text-xs(
        :style="{ backgroundColor: midiColor(user.midi, 1, 0.5) }"
      ) {{ notes[(user.midi - 9) % 12] }}
</template>