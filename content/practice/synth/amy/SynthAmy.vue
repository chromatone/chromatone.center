<script setup>
import { useAMY } from './useAMY';


const { knobs, waveforms, reset, note, play, message, history } = useAMY()

</script>

<template lang='pug'>
.p-2.rounded-xl.border-1.m-2.select-none.flex.flex-wrap.gap-2
  transition-group(name="fade")
    control-rotary(
      key="Wave"
      :min="0"
      :max="11"
      param="Wave"
      v-model="knobs.w"
      :fixed="0"
      :unit="waveforms[knobs.w]"
    )
    control-rotary(
      key="Patch"
      :min="1"
      :max="1024"
      param="Patch"
      v-model="knobs.p"
      v-if="knobs.w > 6"
      :fixed="0"
    )
    control-rotary(
      key="Duty"
      :min="0.001"
      :max=".999"
      param="Duty"
      :step="0.01"
      v-if="knobs.w == 1"
      v-model="knobs.d"
      :fixed="2"
    )
    control-rotary(
      key="Algo"
      :min="1"
      :max="32"
      param="ALGO"
      v-if="knobs.w == 8"
      v-model="knobs.o"
      :fixed="0"
    )
    control-rotary(
      key="Feedback"
      :min="0"
      :max="1"
      param="Feedback"
      v-model="knobs.b"
      v-if="knobs.w > 5"
      :fixed="1"
      :step="0.01"
    )
    control-rotary(
      key="volume"
      :min="0"
      :max="10"
      param="Volume"
      v-model="knobs.V"
      :fixed="1"
      :step="0.01"
    )
    .flex-auto(key="flex")
    button.text-button(@click="reset()" key="reset") RESET

input.p-4.flex.items-center.font-mono(v-model="message")

.top-16.right-4.p-4.w-80.max-h-80vh.overflow-hidden.flex.flex-col.opacity-30.pointer-events-none.font-mono.text-sm.fixed
  .font-bold.border-b-2 {{ message }}
  transition-group(name="fade")
    .p-0(v-for="rec in history" :key="rec") {{ rec }}
//- .flex.flex-wrap.gap-4
//-   .text-2xl Floats
//-   .p-2.flex(v-for="(knob,key) in amy.knobs" :key="key") 
//-     .text-xl {{ key }}: {{ knob.name}}
//-       control-knob(
//-         :param="knob.name"
//-         :min="knob.min"
//-         :max="knob.max"
//-         v-model="knob.current.value"
//-         :step="0.01"
//-       )
//- pre {{ amy.knobs }}
//TODO - string, uint, mask
</template>