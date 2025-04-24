// ✅ File: src/components/Television.tsx
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

const Television = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  // ✅ Video setup
  const video = useMemo(() => Object.assign(document.createElement('video'), {
    src: '/my-room-3d/assets/3004.mp4',
    crossOrigin: 'anonymous',
    loop: true,
    muted: false,
    autoplay: false, // Không autoplay nếu có tiếng
    playsInline: true,
    controls: true
  }), [])

  const texture = useMemo(() => new THREE.VideoTexture(video), [video])

  // ✅ Controls
  const {
    width, height, posX, posY, posZ,
    rotX, rotY, rotZ,
    play, volume
  } = useControls('Television Controls', {
    width: { value: 4.23, min: 0, max: 10, step: 0.001 },
    height: { value: 2.39, min: 0, max: 10, step: 0.001 },
    posX: { value: 4.20, min: -10, max: 10, step: 0.001 },
    posY: { value: 2.66, min: -10, max: 10, step: 0.001 },
    posZ: { value: 1.83, min: -10, max: 10, step: 0.001 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.001 },
    rotY: { value: -1.57, min: -Math.PI, max: Math.PI, step: 0.001 },
    rotZ: { value: 0.00, min: -Math.PI, max: Math.PI, step: 0.001 },
    play: { value: true, label: '🔈 Play Video' },
    volume: { value: 1.0, min: 0, max: 1, step: 0.01, label: '🔊 Volume' },
  }, { collapsed: false })

  // ✅ Play/pause + volume update
  useEffect(() => {
    video.volume = volume
    if (play) {
      video.play().catch(console.warn)
    } else {
      video.pause()
    }
  }, [play, volume, video])

  useFrame(() => {
    if (video.readyState >= 2 && play && video.paused) video.play()
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
