<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div class="counter">
    <button @click="increment">Click</button>
    Kliknięcia: <strong>{{ count }}</strong>
  </div>
</template>

<style scoped>
.counter {
  margin: 10px 0;
}

button {
  padding: 10px 16px;
  background-color: #42b983;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}
button:hover {
  background-color: #2c9d6d;
}

p {
  margin-top: 10px;
  font-size: 14px;
}
</style>
