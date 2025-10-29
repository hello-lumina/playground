<script setup>
import { ref } from 'vue'
import UIButton from './UIButton.vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div class="counter">
    <UIButton @click="increment">Click</UIButton>
    <p>
      Kliknięcia: <strong>{{ count }}</strong>
    </p>
  </div>
</template>

<style scoped>
.counter {
  margin: 10px 0;
}

p {
  margin-top: 10px;
  font-size: 14px;
  color: #444;
}
</style>
