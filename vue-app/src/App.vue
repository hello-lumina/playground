<script setup>
import { ref } from 'vue'
import CounterButton from './components/CounterButton.vue'
import ColorBox from './components/ColorBox.vue'
import ChildPing from './components/ChildPing.vue'
import UIButton from './components/UIButton.vue'

const currentColor = ref('red')
const pingMessage = ref('Czekam ping')

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function toggleColor() {
  currentColor.value = getRandomColor()
}

function handlePing() {
  pingMessage.value = 'Otrzymalem pinga'
}
</script>

<template>
  <div class="container">
    <h1 class="title">Ćwiczenia z Vue</h1>

    <div class="row">
      <div class="block">
        <CounterButton />
      </div>

      <div class="block">
        <ColorBox :color="currentColor" />
        <UIButton @click="toggleColor"> Zmień kolor </UIButton>
      </div>

      <div class="block">
        <ChildPing @ping="handlePing" />
        <p class="ping-msg">{{ pingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 40px 20px;
}

.title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 30px;
  color: #2c3e50;
}

.row {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
}

.block {
  text-align: center;
}

.ping-msg {
  margin-top: 12px;
  font-weight: bold;
  color: #444;
}
</style>
