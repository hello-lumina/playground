<script setup>
import { ref } from 'vue'

const box = ref(null)
</script>

<template>
  <div ref="box" class="three-canvas"></div>
</template>

<style scoped>
.three-canvas {
  width: 100%;
  height: 60vh;
  background-color: #808080;
  border-radius: 8px;
}
</style>
