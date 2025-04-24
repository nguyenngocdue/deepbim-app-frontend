// ✅ File: src/components/Television.tsx
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

const Television = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  const video = useMemo(() => Object.assign(document.createElement('video'), {
    src: '/my-room-3d/assets/3004.mp4',
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    autoplay: true,
    playsInline: true,
  }), [])

  const texture = useMemo(() => new THREE.VideoTexture(video), [video])

  const { width, height, posX, posY, posZ, rotX, rotY, rotZ } = useControls('Television Controls', {
    width: { value: 4.23, min: 0, max: 10, step: 0.001 },
    height: { value: 2.39, min: 0, max: 10, step: 0.001 },
    posX: { value: 4.20, min: -10, max: 10, step: 0.001 },
    posY: { value: 2.66, min: -10, max: 10, step: 0.001 },
    posZ: { value: 1.83, min: -10, max: 10, step: 0.001 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.001 },
    rotY: { value: -1.57, min: -Math.PI, max: Math.PI, step: 0.001 },
    rotZ: { value: 0.00, min: -Math.PI, max: Math.PI, step: 0.001 },
  })

  useFrame(() => {
    if (video.readyState >= 2 && video.paused) video.play()
  })

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, posZ]}
      rotation={[rotX, rotY, rotZ]}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

export default Television
