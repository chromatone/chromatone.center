<script setup>

</script>

<template lang='pug'>
svg(ref="svgElem" viewBox="0 -25 500 50")
  polyline(
    stroke-width="2"
    stroke="currentColor"
    fill="transparent"
    :points="analyser.oscPoints"
    )
</template>