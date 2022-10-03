import { PerspectiveCamera, Group } from 'three'
import { scene, sizes } from './renderer'

const VERTICAL_FIELD_OF_VIEW = 35 // degrees 45 is the normal

export const camera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.setZ(6)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
})

export const cameraGroup = new Group()
cameraGroup.add(camera)
scene.add(cameraGroup)
export default camera
