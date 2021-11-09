<template lang="pug">

</template>

<script setup>
import paper from 'paper'

const layer = new paper.Layer({
  name: 'poiner'
});
const pos = ref([0, 0]);

const pointer = new paper.Shape.Circle({
  center: paper.view.center,
  radius: 5,
  opacity: 0.5,
  fillColor: '#555',
})
const place = new paper.Shape.Circle({
  center: paper.view.center,
  radius: 40,
  opacity: 0.1,
  fillColor: '#555',
})

paper.view.on('mousemove', ev => {
  pointer.set({ position: ev.point })
})

paper.view.on('mousedown', (ev) => {
  pos.value[0] = ev.point.x
  pos.value[1] = ev.point.y

  place.tween({ position: ev.point }, {
    easing: 'easeInOutCubic',
    duration: 600
  })
})

onBeforeUnmount(() => {
  pointer.remove()
  place.remove()
  paper.view.off('mousemove')
  paper.view.off('nousedown')
});


</script>
