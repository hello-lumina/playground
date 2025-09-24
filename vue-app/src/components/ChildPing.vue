<script setup>
const emit = defineEmits(['ping'])
function sendPing() {
  emit('ping')
}
</script>

<template>
  <button @click="sendPing">Wyślij ping</button>
</template>

<style scoped>
button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background-color: #42b983;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}
button:hover {
  background-color: green;
}
</style>
