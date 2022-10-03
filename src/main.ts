import * as THREE from 'three'
import { renderer, scene, sizes } from './core/renderer'
import { fpsGraph } from './core/gui'
import camera , {cameraGroup} from './core/camera'
import * as dat from 'lil-gui'
import gsap from 'gsap'

import gradient3 from './static/textures/gradients/3.jpg'

import './style.css'

const parameters = {
  materialColor: "#ffeded"
}

/**
 * Objects
 */
// texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load(gradient3)
gradientTexture.magFilter = THREE.NearestFilter
//material
const material = new THREE.MeshToonMaterial({ 
  color: parameters.materialColor,
  gradientMap: gradientTexture
})


// ================ MESHES ================
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1,0.4, 16, 60),
  material)

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material)


const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material)

scene.add(mesh1, mesh2, mesh3)

const objectDistance = 4;
const sectionMeshes = [mesh1, mesh2, mesh3]
const isEven = (n:number) => n % 2 === 0
sectionMeshes.forEach((m, idx) => {
  m.position.y = objectDistance * -idx;
  m.position.x = isEven(idx) ? 2 : -2
})
// ================ END OF MESHES ================

// ================ cursor ================
const cursor = {
  x:0,
  y:0
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})


// DAT GUI
const datgui = new dat.GUI();
datgui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
      material.color.set(parameters.materialColor)
      particaleMaterial.color.set(parameters.materialColor)
    })

// ================ Lights ================
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


// =============== Particles =============
const particleCount = 200
const positions = new Float32Array(particleCount * 3)
for(let i=0; i< particleCount; i++){
  positions[i*3 + 0] = (Math.random() - 0.5) * 10
  positions[i*3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
  positions[i*3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
// particle material
const particaleMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03
})
const particles = new THREE.Points(particleGeometry, particaleMaterial)
scene.add(particles)

const clock = new THREE.Clock()


// ================ ANIMATION ================
let currentSection = 0
window.addEventListener('scroll', () => {
  const newSection = Math.round(window.scrollY / sizes.height)

  // detect change section
  if(newSection !== currentSection){
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: '+=6',
      y: '+=3',
      z: '+=1.5'
    })
  }
})

let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  //Animate Camera
  camera.position.y = -1 * window.scrollY/sizes.height * objectDistance

  // delta time to avoid rerender fps
  cameraGroup.position.x += (cursor.x - cameraGroup.position.x) * 3 * deltaTime
  cameraGroup.position.y += (cursor.y - cameraGroup.position.y) * 3 * deltaTime

  //Animate Meshes
  // sectionMeshes.forEach(m => {
  //   m.rotation.x = elapsedTime * 0.1
  //   m.rotation.y = elapsedTime * 0.12
  // })

  fpsGraph.begin()

  // controls.update()
  renderer.render(scene, camera)

  fpsGraph.end()
  requestAnimationFrame(tick)
}

tick()
