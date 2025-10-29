<script setup></script>

<template>
  <button class="btn" @click="$emit('click', $event)">
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.btn {
  border: none;
  border-radius: 6px;
  background-color: #42b983;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  padding: 10px 18px;
  font-size: 15px;
}

.btn:hover {
  background-color: #2c9d6d;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}
</style>
