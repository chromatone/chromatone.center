<script setup>
import { joinRoom } from 'trystero'
import { onMounted } from 'vue';

onMounted(() => {


  const room = joinRoom({ appId: 'chromatone' }, 'P2P Music Connections')

  room.onPeerJoin(peerId => console.log(`${peerId} joined`))
  room.onPeerLeave(peerId => console.log(`${peerId} left`))

  const [sendMove, getMove] = room.makeAction('mouseMove')
  const [sendClick, getClick] = room.makeAction('click')

  window.addEventListener('mousemove', e => sendMove([e.clientX, e.clientY]))
  window.addEventListener('click', () => sendClick(10))

  getMove(([x, y], peerId) => console.log(x, y, peerId))
  getClick((fruit, peerId) => console.log(fruit, peerId))
})
</script>

<template lang='pug'>
.p-4 P2P
  .p-2 {{ room }}
</template>