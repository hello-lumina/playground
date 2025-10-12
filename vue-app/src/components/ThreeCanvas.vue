<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const canvasContainer = ref(null)
let scene,
  camera,
  renderer,
  animationFrameId,
  cube,
  ambientLight,
  pointLight,
  controls,
  raycaster,
  mouse

const initThree = () => {
  //scena
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  //camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  //swiatlo
  ambientLight = new THREE.AmbientLight('white', 1)
  pointLight = new THREE.PointLight('white', 10, 50)
  pointLight.position.set(0.5, 1, 1)
  scene.add(ambientLight)
  scene.add(pointLight)

  //render
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)

  //camera
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.5
  controls.screenSpacePanning = false
  controls.minDistance = 2
  controls.maxDistance = 10

  //obiekt
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshStandardMaterial({ color: 'blue' })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  //
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
}

const onPointerDown = (event) => {
  if (!renderer) return
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects([cube])
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000)
  }
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  controls.update()
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
  width: 100%;
  height: 100vh;
  border-radius: 9px;
  overflow: hidden;
}
</style>
