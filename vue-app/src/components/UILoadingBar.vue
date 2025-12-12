<script setup>
defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="loading-overlay">
    <div class="loading-container">
      <h2>Ładowanie modelu 3D...</h2>
      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: progress + '%' }"
        ></div>
      </div>
      <div class="progress-text">{{ progress }}%</div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-container {
  text-align: center;
  color: white;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
}

.progress-bar {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00ccff);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  margin-top: 12px;
  font-size: 18px;
  color: #00ff88;
  font-weight: 600;
}
</style>