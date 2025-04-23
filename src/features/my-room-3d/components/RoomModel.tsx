// ✅ File: src/components/RoomModel.tsx
import { useGLTF } from '@react-three/drei'
import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader, VideoTexture, MeshBasicMaterial } from 'three'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useControls as useLevaControls } from 'leva'

// @ts-ignore
import fragmentShader from './shaders/baked/fragment.glsl?raw'
// @ts-ignore
import vertexShader from './shaders/baked/vertex.glsl?raw'

const RoomModel = () => {
  const room = useGLTF('/my-room-3d/assets/roomModel.glb')
  const pcScreen = useGLTF('/my-room-3d/assets/pcScreenModel.glb')
  const macScreen = useGLTF('/my-room-3d/assets/macScreenModel.glb')
  const topChair = useGLTF('/my-room-3d/assets/topChairModel.glb')
  const coffeeSteam = useGLTF('/my-room-3d/assets/coffeeSteamModel.glb')
  const elgatoLight = useGLTF('/my-room-3d/assets/elgatoLightModel.glb')
  const googleLeds = useGLTF('/my-room-3d/assets/googleHomeLedsModel.glb')
  const loupedeck = useGLTF('/my-room-3d/assets/loupedeckButtonsModel.glb')

  const [bakedDay, bakedNight, bakedNeutral, lightMap] = useLoader(TextureLoader, [
    '/my-room-3d/assets/bakedDay.jpg',
    '/my-room-3d/assets/bakedNight.jpg',
    '/my-room-3d/assets/bakedNeutral.jpg',
    '/my-room-3d/assets/lightMap.jpg'
  ])

  useEffect(() => {
    bakedDay.flipY = false
    bakedNight.flipY = false
    bakedNeutral.flipY = false
    lightMap.flipY = false
  }, [bakedDay, bakedNight, bakedNeutral, lightMap])

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uBakedDayTexture: { value: bakedDay },
      uBakedNightTexture: { value: bakedNight },
      uBakedNeutralTexture: { value: bakedNeutral },
      uLightMapTexture: { value: lightMap },

      uNightMix: { value: 0.67 },
      uNeutralMix: { value: 0.0 },

      uLightTvColor: { value: new THREE.Color('#ff115e') },
      uLightTvStrength: { value: 1.99 },

      uLightDeskColor: { value: new THREE.Color('#ff6700') },
      uLightDeskStrength: { value: 1.47 },

      uLightPcColor: { value: new THREE.Color('#0082ff') },
      uLightPcStrength: { value: 1.47 },
    },
    side: THREE.DoubleSide,
  }), [bakedDay, bakedNight, bakedNeutral, lightMap])

  useEffect(() => {
    room.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = shaderMaterial
      }
    })
  }, [room.scene, shaderMaterial])

  // ✅ VIDEO TEXTURES
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

  const { rotationY } = useLevaControls('Model Transform', {
    rotationY: { value: 1.13, min: -Math.PI, max: Math.PI, step: 0.01 },
  })
  
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

  return (
    <group rotation={[0, rotationY, 0]}>
      <primitive object={room.scene} />
      <primitive object={pcScreen.scene} position={[0, 0, 0]} />
      <primitive object={macScreen.scene} position={[0, 0, 0]} />
      <primitive object={topChair.scene} position={[0, 0, 0]} />
      <primitive object={coffeeSteam.scene} position={[0.4, 1.0, 0.2]} />
      <primitive object={elgatoLight.scene} position={[1.0, 1.1, -1.5]} />
      <primitive object={googleLeds.scene} position={[-0.5, 0.95, -0.8]} />
      <primitive object={loupedeck.scene} position={[0.2, 0.85, -1.0]} />
    </group>
  )
}

export default RoomModel
