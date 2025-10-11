<script setup>
import ThreeCanvas from './components/ThreeCanvas.vue'
</script>

<template>
  <div class="app">
    <h1>Three.js Canvas</h1>
    <ThreeCanvas />
  </div>
</template>

<style scoped>
app {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h1 {
  color: #333;
  font-size: 27px;
}
</style>
