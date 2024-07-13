<script setup>
import { useChat, useUser } from '@gun-vue/composables'
import { ref } from 'vue';

const message = ref('')

const { send, currentChat, sorted } = useChat()

const { user, auth } = useUser()

</script>

<template lang='pug'>
.flex.flex-col GUN {{ currentChat }}  
  input(v-model="message")
  button(@click="send(message)") Send
  .flex.flex-col.gap-1.p-1.text-xs
    .p-1.bg-light-400(v-for="message in sorted" :key="message.timestamp") {{ message.text }}
</template>