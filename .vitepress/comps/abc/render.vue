<template lang="pug">
.flex.flex-col.items-center
  .render(:id="id") {{ abc }}
</template>

<script setup>
const props = defineProps({
  abc: {
    type: String,
    default: 'ABCD'
  },
})

const id = (Math.random() + 1).toString(36).substring(7)

onMounted(() => {
  import('abcjs').then(ABCJS => {
    watchEffect(() => {
      let visualObj = ABCJS.renderAbc(id, props.abc, {
        // responsive: 'resize',
        scale: 3,
        add_classes: true,
        paddingbottom: -20,
        paddingtop: 0,
        staffwidth: 300,
        clickListener,
      })
    })
  })
});

function clickListener(elem, tune, classes, analysis, drag) {
  console.log(elem)
}
</script>
 
<style scoped>
</style>