<script setup>
import ThreeCanvas from './components/ThreeCanvas.vue'
import UIParagraph from './components/UIParagraph.vue'
</script>

<template>
  <div class="app">
    <div class="canvas-wrapper">
      <div class="text-overlay">
        <UIParagraph text="Kliknij obiekt, aby zmienić kolor" type="h5" />
      </div>
      <ThreeCanvas />
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

h1 {
  color: #333;
  font-size: 27px;
}
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.text-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}
</style>
