<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
const canvasContainer = ref(null)
let scene, camera, renderer, animationFrameId
const box = ref(null)

const initThree = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000)
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)
}
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  const handleResize = () => {
    if (!canvasContainer.value) return

    const width = canvasContainer.value.clientWidth
    const height = canvasContainer.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
}

  onMounted(() => {
    initThree()
    animate()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => { window.removeEventListener('resize', handleResize)

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    if (renderer) {
      renderer.dispose()
    }
  })
</script>

<template>
  <div ref="canvasContainer" class="three-canvas"></div>
</template>

<style scoped>
.three-canvas {
  width: 100%;
  height: 60vh;
  border-radius: 8px;
  overflow: hidden;
}
</style>
