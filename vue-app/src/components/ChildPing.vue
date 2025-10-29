<script setup>
import UIButton from './UIButton.vue'

const emit = defineEmits(['ping'])

function sendPing() {
  emit('ping')
}
</script>

<template>
  <UIButton @click="sendPing"> Wyślij ping </UIButton>
</template>
