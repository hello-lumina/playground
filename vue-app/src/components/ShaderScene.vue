<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders/customShader'

const canvasRef = ref(null)
const shaderEnabled = ref(true)
const toonShading = ref(false)
const color = ref('#42b983')

let scene, camera, renderer, mesh, clock
let shaderMaterial, standardMaterial
let animationId

onMounted(() => {
  initScene()
  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
  }
})

function initScene() {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)

  // Camera
  camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)


  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32)

  // uTime (float), uColor (vec3)
  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color.value) },
      uToonShading: { value: toonShading.value }
    },
    vertexShader,
    fragmentShader
  })


  standardMaterial = new THREE.MeshStandardMaterial({
    color: color.value,
    roughness: 0.5,
    metalness: 0.5
  })


  mesh = new THREE.Mesh(geometry, shaderMaterial)
  scene.add(mesh)


  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0x404040))


  clock = new THREE.Clock()


  window.addEventListener('resize', onResize)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()


  if (mesh.material.uniforms?.uTime) {
    mesh.material.uniforms.uTime.value = elapsed
  }


  mesh.rotation.x = elapsed * 0.2
  mesh.rotation.y = elapsed * 0.3

  renderer.render(scene, camera)
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}


watch(shaderEnabled, (enabled) => {
  if (!mesh) return
  mesh.material = enabled ? shaderMaterial : standardMaterial
})


watch(color, (newColor) => {
  const threeColor = new THREE.Color(newColor)

  if (shaderMaterial.uniforms?.uColor) {
    shaderMaterial.uniforms.uColor.value = threeColor
  }

  if (standardMaterial) {
    standardMaterial.color = threeColor
  }
})


watch(toonShading, (enabled) => {
  if (shaderMaterial.uniforms?.uToonShading) {
    shaderMaterial.uniforms.uToonShading.value = enabled
  }
})
</script>

<template>
  <div class="shader-scene">
    <div class="controls">


      <div class="controls-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="shaderEnabled">
          <span>Shader ON</span>
        </label>

        <label v-if="shaderEnabled" class="checkbox-label">
          <input type="checkbox" v-model="toonShading">
          <span>Toon Shading</span>
        </label>

        <div class="color-picker">
          <label>uColor:</label>
          <input type="color" v-model="color">
        </div>

        <div class="status">
          {{ shaderEnabled ? '✓ ShaderMaterial' : '✓ MeshStandardMaterial' }}
        </div>
      </div>


    </div>

    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.shader-scene {
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
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

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
}

.color-picker input {
  width: 48px;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
}

.status {
  margin-left: auto;
  color: #9ca3af;
  font-size: 14px;
}

</style>