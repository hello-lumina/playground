<script setup>
defineProps({
  color: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="box" :style="{ backgroundColor: color }"></div>
</template>

<style scoped>
.box {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #ddd;
  margin: 10px auto;
  transition: background-color 0.3s;
}
</style>
