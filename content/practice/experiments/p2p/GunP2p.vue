<script setup>
import { midi, midiColor, notes, playNoteOnce } from '#/use';
import { Gun, SEA } from '@gun-vue/gun-es'
import { gunAvatar } from 'gun-avatar'
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowReactive, watch } from 'vue';

const gun = Gun({ peers: ['https://peer.wallie.io/gun'] });

const appName = `test-app-1000`

const userPub = ref('')
const name = ref('')
const pair = ref(null)
const users = reactive({})
const intervals = []
const subs = []

watch(name, n => gun.user().get('name').put(n))

watch(() => midi.note, note => gun.user().get('midi').put(note.number))

onMounted(() => {
  gun.user().recall({ sessionStorage: true });
  generate()

  subs.push(gun.on("auth", () => {
    userPub.value = gun.user().is?.pub
    subs.push(gun.user().get('name').on(n => name.value = n))
    subs.push(gun.get(appName).get('personal').get(userPub.value).on(d => playNoteOnce(midi.note.number)))
    intervals.push(setInterval(() => gun.get(appName).get('users').get(userPub.value).put(Date.now()), 1000))
  }))


  subs.push(gun.get(appName).get('users').map().on((d, pub) => {
    if (Date.now() - d < 8000) {
      users[pub] = users[pub] || {}
      users[pub].timestamp = d
      gun.user(pub).get('name').once(d => users[pub].name = d)
      gun.user(pub).get('midi').once(d => users[pub].midi = d)
    }
  }))

  subs.push(gun.get(appName).get('play').on(() => playNoteOnce(midi.note.number)))

  intervals.push(setInterval(() => {
    for (let pub in users) {
      if (0 > (Date.now() - users[pub].timestamp) > 6000) {
        delete users[pub]
      }
    }
  }, 10000))
})

onBeforeUnmount(() => {
  intervals.forEach(int => clearInterval(int))
  subs.forEach(s => s?.off?.())
})


function play() { gun.get(appName).get('play').put(Date.now()) }

function trigger(pub) { gun.get(appName).get('personal').get(pub).put(Date.now()) }

async function generate() { pair.value = await SEA.pair() }

function leave() { gun.user().leave(); setTimeout(() => { if (!gun.user()?.is) { userPub.value = null } }, 1000); }

</script>

<template lang='pug'>
.flex.flex-col.p-2.gap-2
  .flex.gap-2.p-2.items-center.flex-wrap(v-if="userPub")

    img(style="width:60px" :src="gunAvatar({ pub: userPub })")
    input.p-1(v-model="name")
    .p-2.rounded-xl(:style="{ backgroundColor: midiColor(midi.note.number) }") {{ notes[midi.note.pitch] }}
    .flex-1
    button.text-button(@click="leave()") Leave

  .flex.p-2.items-center.flex-wrap(v-else)
    button.text-button(@pointerdown="generate()") Generate
    img(style="width:60px" :src="gunAvatar({ pub: pair?.pub })")
    button.text-button(@pointerdown="gun.user().auth(pair)") Enter
  .flex.flex-wrap.items-center.gap-2
    transition-group(name="fade")
      button.text-button(key="all" @pointerdown="play()") Play all
      button.p-2.flex.flex-col.shadow.gap-2.relative.active-op-80.transition(
        @pointerdown="trigger(us)"
        v-for="(user, us) in users" :key="us")
        img(style="width:60px; margin: 0" :src="gunAvatar({ pub: us })")
        .text-xs {{ (user.name || '').slice(0, 18) }} 
        .absolute.bottom-0.right-0.px-1.p-0.rounded-xl.text-xs(
          :style="{ backgroundColor: midiColor(user.midi, 1, 0.5) }"
        ) {{ notes[(user.midi - 9) % 12] }}
 
</template>