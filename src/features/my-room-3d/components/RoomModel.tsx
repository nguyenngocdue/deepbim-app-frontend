// ✅ File: src/components/RoomModel.tsx
import { useGLTF } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, VideoTexture, MeshBasicMaterial, Group, Euler } from 'three'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useControls as useLevaControls } from 'leva'

// @ts-ignore
import fragmentShader from './shaders/baked/fragment.glsl?raw'
// @ts-ignore
import vertexShader from './shaders/baked/vertex.glsl?raw'
import TopChair from './TopChair'
import Experience from './utils/Experience'
import { useShaderMaterial } from './utils/ShaderMaterial'
import CoffeeSteam from './CoffeeSteam'

const RoomModel = () => {
  const room = useGLTF('/my-room-3d/assets/roomModel.glb')
  const pcScreen = useGLTF('/my-room-3d/assets/pcScreenModel.glb')
  const macScreen = useGLTF('/my-room-3d/assets/macScreenModel.glb')
  const elgatoLight = useGLTF('/my-room-3d/assets/elgatoLightModel.glb')
  const googleLeds = useGLTF('/my-room-3d/assets/googleHomeLedsModel.glb')
  const loupedeck = useGLTF('/my-room-3d/assets/loupedeckButtonsModel.glb')


  const groupRef = useRef<Group>(null)

  useEffect(() => {
    room.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = useShaderMaterial();
      }
    })
  }, [room.scene])

  const video1 = useMemo(() => Object.assign(document.createElement('video'), {
    src: '/my-room-3d/assets/videoStream.mp4',
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    autoplay: true,
    playsInline: true,
    controls: true
  }), [])

  const video2 = useMemo(() => Object.assign(document.createElement('video'), {
    src: '/my-room-3d/assets/videoPortfolio.mp4',
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    autoplay: true,
    playsInline: true,
    controls: true
  }), [])

  const videoTexture1 = useMemo(() => new VideoTexture(video1), [video1])
  const videoTexture2 = useMemo(() => new VideoTexture(video2), [video2])

  const videoMaterial1 = useMemo(() => new MeshBasicMaterial({ map: videoTexture1, toneMapped: false }), [videoTexture1])
  const videoMaterial2 = useMemo(() => new MeshBasicMaterial({ map: videoTexture2, toneMapped: false }), [videoTexture2])

  const { xoy, xoz, yoz, posX, posY, posZ } = useLevaControls('Model Transform', {
    xoy: { value: 0.21, min: -Math.PI, max: Math.PI, step: 0.01 },
    xoz: { value: -0.15, min: -Math.PI, max: Math.PI, step: 0.01 },
    yoz: { value: 1.28, min: -Math.PI, max: Math.PI, step: 0.01 },
    posX: { value: -5.00, min: -15, max: 15, step: 0.01 },
    posY: { value: -1.53, min: -15, max: 15, step: 0.01 },
    posZ: { value: 1.11, min: -15, max: 15, step: 0.01 },
  }, {
    collapsed: true
  })

  useEffect(() => {
    if (groupRef.current) {
      const euler = new Euler(xoy, yoz, xoz, 'XYZ')
      groupRef.current.rotation.copy(euler)
      groupRef.current.position.set(posX, posY, posZ)
    }
  }, [xoy, xoz, yoz, posX, posY, posZ])

  useEffect(() => {
    video1.load()
    video1.play().catch((e) => console.warn('videoStream.mp4 play failed:', e))
    video2.load()
    video2.play().catch((e) => console.warn('videoPortfolio.mp4 play failed:', e))
  }, [video1, video2])

  useEffect(() => {
    pcScreen.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.toLowerCase().includes('screen')) {
        (child as THREE.Mesh).material = videoMaterial1
      }
    })

    macScreen.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.toLowerCase().includes('screen')) {
        (child as THREE.Mesh).material = videoMaterial2
      }
    })
  }, [pcScreen.scene, macScreen.scene, videoMaterial1, videoMaterial2])

  const experience = new Experience()
  const time = experience.time;


  return (
    <group ref={groupRef} name="room">
      <primitive object={room.scene} />
      <primitive object={pcScreen.scene} position={[0, 0, 0]} />
      <primitive object={macScreen.scene} position={[0, 0, 0]} />
      <TopChair time={time} />
      <CoffeeSteam time={time} />
      <primitive object={elgatoLight.scene} position={[1.0, 1.1, -1.5]} />
      <primitive object={googleLeds.scene} position={[-0.5, 0.95, -0.8]} />
      <primitive object={loupedeck.scene} position={[0.2, 0.85, -1.0]} />
    </group>
  )
}

export default RoomModel