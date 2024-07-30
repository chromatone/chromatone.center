<script setup>
import { joinRoom } from 'trystero'
const room = joinRoom({ appId: 'trystero-lounge' }, '101')

room.onPeerJoin(console.log)
room.onPeerLeave(console.log)

const [sendMove, getMove] = room.makeAction('mouseMove')
const [sendClick, getClick] = room.makeAction('click')

window.addEventListener('mousemove', e => sendMove([e.clientX, e.clientY]))
window.addEventListener('click', () => sendClick(10))

getMove(([x, y], peerId) => console.log(x, y))
getClick((fruit, peerId) => console.log(fruit))

</script>

<template lang='pug'>
.p-4 P2P
  .p-2 {{ room }}
</template>