<script setup>
defineProps({
  text: { type: String, required: true },
  type: { type: String, default: 'h5' },
})
</script>

<template>
  <component :is="type">{{ text }}</component>
</template>

<style scoped>
h2,
h3,
h4,
h5 {
  margin: 8px 0;
  font-weight: 600;
  color: #333;
}
</style>
