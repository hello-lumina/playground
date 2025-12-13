<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import UILoadingBar from './UILoadingBar.vue'
import UIParagraph from './UIParagraph.vue'

const canvasRef = ref(null)
const effectsEnabled = ref(true)
const bloomStrength = ref(0.3)
const isLoading = ref(true)
const progress = ref(0)
const lightIntensity = ref(2)
const shadowsEnabled = ref(true)
const showCube = ref(true)
const animationDuration = ref(0.7)
const isAnimating = ref(false)

let scene, camera, renderer, model, floor, cube, clock, controls, raycaster, mouse
let composer, bloomPass, directionalLight
let animationId

// Stan animacji
let animationStartTime = 0
let originalCubePosition = null
let originalCubeRotation = null

onMounted(() => {
  initScene()
  loadModel()
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  if (controls) controls.dispose()
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', onCanvasClick)
  }
})

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.set(3, 3, 5)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Podłoga
  const floorGeometry = new THREE.PlaneGeometry(6, 6)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.2
  })
  floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0
  floor.receiveShadow = true
  scene.add(floor)


  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 0.8
  })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(0, 0.5, 0)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)

  // Directional Light
  directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity.value)
  directionalLight.position.set(5, 8, 3)
  directionalLight.castShadow = true

  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10

  scene.add(directionalLight)
  scene.add(new THREE.AmbientLight(0x404040, 0.5))

  // Kompozytor
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

  // Raycaster
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  canvasRef.value.addEventListener('click', onCanvasClick)

  window.addEventListener('resize', onResize)
}

function onCanvasClick(event) {
  if (isAnimating.value || !cube) {
    console.log('Ignoruję kliknięcie - animacja w trakcie')
    return
  }

  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObject(cube)

  if (intersects.length > 0) {
    console.log('Kliknięto cube! Uruchamiam animację')
    startCubeAnimation()
  } else {
    console.log('Kliknięto poza cube')
  }
}

function startCubeAnimation() {
  isAnimating.value = true
  animationStartTime = clock.getElapsedTime()

  originalCubePosition = {
    x: cube.position.x,
    y: cube.position.y,
    z: cube.position.z
  }
  originalCubeRotation = {
    x: cube.rotation.x,
    y: cube.rotation.y,
    z: cube.rotation.z
  }

  console.log('Animacja startuje z pozycji:', originalCubePosition)
}

function updateCubeAnimation() {
  if (!isAnimating.value || !cube) return

  const elapsed = clock.getElapsedTime() - animationStartTime
  const duration = animationDuration.value
  const progress = elapsed / duration

  if (progress >= 1) {

    cube.position.set(
        originalCubePosition.x,
        originalCubePosition.y,
        originalCubePosition.z
    )
    cube.rotation.set(
        originalCubeRotation.x,
        originalCubeRotation.y,
        originalCubeRotation.z
    )
    isAnimating.value = false
    console.log('Animacja zakończona')
    return
  }


  const jumpHeight = 2
  const jump = Math.sin(progress * Math.PI) * jumpHeight
  cube.position.y = originalCubePosition.y + jump


  const rotationAmount = Math.PI * 2
  cube.rotation.y = originalCubeRotation.y + (progress * rotationAmount)
}

function loadModel() {
  const loadingManager = new THREE.LoadingManager()

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progress.value = Math.round((itemsLoaded / itemsTotal) * 100)
  }

  loadingManager.onLoad = () => {
    isLoading.value = false
  }

  loadingManager.onError = (url) => {
    console.error('Błąd ładowania:', url)
    isLoading.value = false
  }

  const loader = new GLTFLoader(loadingManager)

  loader.load(
      '/models/duck.glb',
      (gltf) => {
        model = gltf.scene

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        model.scale.setScalar(scale)

        box.setFromObject(model)
        const minY = box.min.y
        model.position.y = -minY
        model.position.x = 1.5
        model.position.z = 0

        scene.add(model)
        console.log('Model załadowany')
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          progress.value = Math.round((xhr.loaded / xhr.total) * 100)
        }
      },
      (error) => {
        console.error('Błąd ładowania modelu:', error)
      }
  )
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()


  updateCubeAnimation()

  // Obracaj TYLKO model (duck), cube jest statyczny
  if (model) {
    model.rotation.y = elapsed * 0.3
  }

  if (controls) {
    controls.update()
  }

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

watch(lightIntensity, (value) => {
  if (directionalLight) {
    directionalLight.intensity = value
  }
})

watch(shadowsEnabled, (enabled) => {
  if (renderer) {
    renderer.shadowMap.enabled = enabled
  }
  if (directionalLight) {
    directionalLight.castShadow = enabled
  }
})

watch(showCube, (visible) => {
  if (cube) {
    cube.visible = visible
  }
})
</script>

<template>
  <div class="model-scene">
    <UILoadingBar v-if="isLoading" :progress="progress" />

    <div class="controls" v-if="!isLoading">
      <h1>Model 3D + Cube + Animacja</h1>

      <UIParagraph variant="h5">
        Kliknij zielony cube, żeby zobaczyć animację podskoku
      </UIParagraph>

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

        <label class="checkbox-label">
          <input type="checkbox" v-model="shadowsEnabled">
          <span>Pokaż cienie</span>
        </label>

        <label class="checkbox-label">
          <input type="checkbox" v-model="showCube">
          <span>Pokaż cube</span>
        </label>

        <div class="slider-control">
          <label>Jasność światła: {{ lightIntensity.toFixed(1) }}</label>
          <input
              type="range"
              v-model.number="lightIntensity"
              min="0.5"
              max="5"
              step="0.5"
          >
        </div>

        <div class="slider-control">
          <label>Czas animacji: {{ animationDuration.toFixed(1) }}s</label>
          <input
              type="range"
              v-model.number="animationDuration"
              min="0.3"
              max="1.5"
              step="0.1"
          >
        </div>

        <div class="status">
          {{ effectsEnabled ? '✓ Kompozytor' : '✓ Direct' }} |
          {{ shadowsEnabled ? '✓ Cienie' : '✗ Bez cieni' }} |
          {{ isAnimating ? '🎬 Animacja' : '✓ Gotowy' }}
        </div>
      </div>

      <div class="info">
        Cube jest statyczny - kliknij w niego aby uruchomić animację podskoku i obrotu.
        W czasie animacji kolejne kliknięcia są ignorowane.
      </div>
    </div>

    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.model-scene {
  width: 100vw;
  height: 100vh;
  background: #000;
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
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
  pointer-events: auto;
}

h1 {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
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
  background: rgba(55, 65, 81, 0.8);
  color: #d1d5db;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}
</style>