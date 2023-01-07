<script setup>
import { globalScale } from '#/use/chroma';
import { noteColor } from '#/use/colors';
import { useTempo } from '#/use/tempo';
import { scaleList } from '#/use/theory';
const tempo = useTempo()

</script>

<template lang='pug'>
#screen
	full-screen.absolute.-top-6.right-2
	state-transport
	p {{ scaleList.length }}
</template>