<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const canvasRef = ref(null)
const effectsEnabled = ref(true)
const bloomStrength = ref(0.3)

let scene, camera, renderer, cube, clock
let composer, bloomPass
let animationId

onMounted(() => {
  initScene()
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})

function initScene() {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  // Camera
  camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.z = 5


  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)


  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 0.8
  })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)


  const light = new THREE.DirectionalLight(0xffffff, 2)
  light.position.set(5, 5, 5)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0x202020, 0.5))


  composer = new EffectComposer(renderer)


  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)


  bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomStrength.value,
      0.4,
      0.85
  )
  composer.addPass(bloomPass)

  clock = new THREE.Clock()

  window.addEventListener('resize', onResize)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()


  cube.rotation.x = elapsed * 0.3
  cube.rotation.y = elapsed * 0.5


  if (effectsEnabled.value) {
    composer.render()
  } else {

    renderer.render(scene, camera)
  }
}

function onResize() {
  const width = window.innerWidth
  const height = window.innerHeight


  camera.aspect = width / height
  camera.updateProjectionMatrix()


  renderer.setSize(width, height)


  composer.setSize(width, height)


  if (bloomPass) {
    bloomPass.resolution.set(width, height)
  }
}


watch(bloomStrength, (value) => {
  if (bloomPass) {
    bloomPass.strength = value
  }
})
</script>

<template>
  <div class="composer-scene">
    <div class="controls">
      <h1>Post-processing: Bloom Effect</h1>

      <div class="controls-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="effectsEnabled">
          <span>Włącz efekty</span>
        </label>

        <div class="slider-control">
          <label>Siła bloom: {{ bloomStrength.toFixed(2) }}</label>
          <input
              type="range"
              v-model.number="bloomStrength"
              min="0"
              max="0.6"
              step="0.1"
              :disabled="!effectsEnabled"
          >
        </div>

        <div class="status">
          {{ effectsEnabled ? '✓ Kompozytor aktywny' : '✓ Direct render' }}
        </div>
      </div>

      <div class="info">
        Bloom ustawiony na {{ bloomStrength.toFixed(1) }}. Efekt wyraźnie widoczny na sześcianie - zielona poświata.
      </div>
    </div>

    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.composer-scene {
  width: 100vw;
  height: 100vh;
  background: #000;
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(31, 41, 55, 0.95);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

h1 {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-bottom: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
  font-weight: 500;
}

.checkbox-label input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.slider-control {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: white;
  font-weight: 500;
}

.slider-control input {
  width: 200px;
  cursor: pointer;
}

.slider-control input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  margin-left: auto;
  color: #9ca3af;
  font-size: 14px;
}

.info {
  color: #d1d5db;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}
</style>