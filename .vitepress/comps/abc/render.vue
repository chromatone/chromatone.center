<template lang="pug">
.flex.flex-col.items-center
  .render(:id="id") {{ abc }}
  svg-save(:svg="id" v-if="save")
</template>

<script setup>
const props = defineProps({
  abc: {
    type: String,
    default: 'ABCD'
  },
  staffwidth: {
    type: Number,
    default: 300,
  },
  responsive: {
    type: Boolean,
    default: false
  },
  save: {
    type: Boolean,
    default: false
  }
})

const id = (Math.random() + 1).toString(36).substring(7)

onMounted(() => {
  import('abcjs').then(ABCJS => {
    watchEffect(() => {
      let visualObj = ABCJS.renderAbc(id, props.abc, {
        responsive: props.responsive ? 'resize' : null,
        scale: 3,
        add_classes: true,
        paddingbottom: -10,
        paddingtop: 0,
        staffwidth: 300,
        clickListener,
      })
      console.log(visualObj)
    })
  })
});

function clickListener(elem, tune, classes, analysis, drag) {
  console.log(elem)
}
</script>
 
<style scoped>
</style>