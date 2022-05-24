<script setup>
import { useGun, useUser, useSpace, SEA, gunAvatar, updateProfile } from '@gun-vue/composables'
import { midi } from '@use/midi'
import { pitchColor } from '@use/calculations'
import { notes } from '@use/theory'


const TIMEOUT = 10000

const gun = useGun()

const { user, leave } = useUser()

const name = ref('')
const pair = ref()

const db = gun.get('chromatone')

const guests = reactive({})

gun.user().get('profile').get('name').on(n => name.value = n)


watch(() => midi.note, note => {
  if (!user?.is?.pub) return
  gun.user().get('note').put(note.number)
})

async function generate() {
  pair.value = await SEA.pair()
}

function start() {
  gun.user().auth(pair.value, async () => {
    nextTick(() => {
      enter()
    })
    console.log("user is authenticated");
  });
}

db.get('guests').map().once((epub, pub) => {
  guests[pub] = {
    pulse: 0,
  }
  gun.user(pub).on(d => {
    guests[pub].pulse = d.pulse
    guests[pub].note = d.note
  })
  gun.user(pub).get('profile').map().on((d, k) => {
    guests[pub][k] = d
  })
})

function enter() {
  db.get('guests').get(user?.is?.pub).put(user?.is?.epub)
}

const onliners = computed(() => {
  const obj = {};
  for (let g in guests) {
    if (Date.now() - guests[g]?.pulse < TIMEOUT) {
      obj[g] = guests[g];
    }
  }
  return obj;
});

watch(name, n => {
  updateProfile('name', n)
})

</script>

<template lang='pug'>
.flex.flex-col.gap-4(:key="user.is")
  .flex.flex-wrap.gap-2.rounded-3xl.bg-light-800.dark_bg-dark-800.items-center.p-2(v-if="user?.is")
    .font-bold Me:
    img.max-w-20.max-h-20(class="!rounded-4xl !m-0" :src="gunAvatar({ pub: user?.pub, size: 200 })")
    input.dark_bg-dark-900.text-current.p-2.rounded-xl(type="text" v-model="name" placeholder="Your name")
    .flex-1
    button.flex-button(v-if="!guests[user.is.pub]" @click="enter()") Enter
    button.flex-button(@click="leave()") Leave
  .flex(v-else)
    button.flex-button(@click="generate()") Generate
    img.max-w-20.max-h-20(class="!rounded-2xl !m-0" :src="gunAvatar({ pub: pair?.pub, size: 200 })")
    button.flex-button(v-if="pair" @click="start()") Start
  .flex.flex-wrap.gap-2.items-center
    .font-bold Guests:
    .flex.items-center.gap-1.bg-light-800.dark_bg-dark-900.rounded-3xl.p-2(v-for="(guest, pub) in onliners" :key="guest")
      img.max-w-10.max-h-10(class="!rounded-2xl !m-0" :src="gunAvatar({ pub: pub, size: 100 })")
      .p-2.capitalize {{ guest.name }}
      .p-2.rounded-2xl.text-white.w-10.text-center.transition(:style="{ backgroundColor: pitchColor(guest.note - 9, 3) }") {{ notes[(guest.note - 9) % 12] }}
</template> 