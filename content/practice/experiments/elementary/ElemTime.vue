<script setup>
import { useTime } from './useElemTime'

const { time } = useTime()


</script>

<template lang='pug'>
.is-group.flex.flex-wrap 
  .p-2 {{ time.clock }}
</template>