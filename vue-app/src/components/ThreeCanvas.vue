<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
const canvasContainer = ref(null)
let scene, camera, renderer, animationFrameId, cube, ambientLight, pointLight

const initThree = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  ambientLight = new THREE.AmbientLight('white', 1)
  pointLight = new THREE.PointLight('white', 10, 50)
  pointLight.position.set(0.5, 1, 1)
  scene.add(ambientLight)
  scene.add(pointLight)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshStandardMaterial({ color: 'blue' })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
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

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

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
  width: 100vw;
  height: 100vw;
  border-radius: 9px;
  overflow: hidden;
}
</style>
