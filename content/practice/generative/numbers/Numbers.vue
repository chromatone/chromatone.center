<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import * as jisg from 'jisg';
import bigInt from 'big-integer'
import { Note } from 'tonal';
import { globalScale, playNoteOnce } from '#/use';

const sequences = Object.keys(jisg).filter((seq => seq[0] == 'A'))

const seqName = ref('A000045')
const sequence = ref([])
const ended = ref(false)
const num = ref(0)

const generator = computed(() => jisg[seqName.value]())
const numArray = computed(() => bigInt(num.value).toArray(globalScale.pcs.length * 2).value)
const binary = computed(() => num.value.toString(2))
const midiArray = computed(() => numArray.value.map(n => globalScale.tonic + 45 + 12 + n))
const noteArray = computed(() => midiArray.value.map(n => Note.fromMidi(n)))

function playSequence() {
  const value = generator.value.next().value;
  if (value == undefined) return ended.value = true
  num.value = value
  sequence.value.push(value)
}

watch(midiArray, arr => {

  arr.forEach((midiNote, i) => {
    const note = Note.fromMidi(midiNote)
    setTimeout(() => {
      playNoteOnce(note)
    }, 150 * i + 2)

  })
})

watch(seqName, name => {
  ended.value = false
  sequence.value = []
  num.value = 0
})


</script>

<template lang='pug'>
.flex.flex-col.gap-4.p-4()

  .flex.flex-wrap.gap-4.items-center
    .text-2xl Number sequence: 

    select.dark-bg-dark-200.rounded-xl.p-2(v-model="seqName")
      option(v-for="seq in sequences" :key="seq") {{ seq }}
    a(:href="`https://oeis.org/${seqName}`" target="_blank") {{ seqName }} at OEIS
  button.text-button.disabled-op-50(@click="playSequence()" :disabled="ended") Generate next number
  .text-2xl.flex.gap-2
    .p-0(v-for="(note, n) in noteArray" :key="n") {{ note }}
  .text-xl {{ midiArray }}
  .text-xl {{ numArray }}
  .text-xl {{ binary }}
  .text-xl {{ num }}
  .flex.flex-wrap.gap-1
    button.text-xs.p-1.bg-light-900.dark-bg-dark-900(
      @click="num = number"
      v-for="number in sequence" :key="number") {{ number }}
</template>