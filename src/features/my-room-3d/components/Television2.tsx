import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { Html } from '@react-three/drei'

const imagePaths = [
  '/assets/viewers/bridge-pier-rebar.png',
  '/assets/viewers/cantilever-bridge-girder.png',
  '/assets/viewers/civil3d-road.png',
  '/assets/viewers/factory-model.png',
  '/assets/viewers/mep-coordination.png',
  '/assets/viewers/mountain-tunnel-japan.jpg',
  '/assets/viewers/multistory-structure.png',
  '/assets/viewers/simple_bridge.png',
  '/assets/viewers/simply_supported_bridge.png',
  '/assets/viewers/steel-frame-warehouse-ifc.png',
]

const Television2 = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(imagePaths[currentIndex])
  }, [currentIndex])

  const {
    width, height, posX, posY, posZ,
    rotX, rotY, rotZ,
  } = useControls('Image TV Controls', {
    width: { value: 4.2, min: 1, max: 100, step: 0.1 },
    height: { value: 2.34, min: 1, max: 100, step: 0.1 },
    posX: { value: 4.2, min: -20, max: 20, step: 0.1 },
    posY: { value: 2.68, min: -10, max: 10, step: 0.1 },
    posZ: { value: 1.85, min: -10, max: 10, step: 0.1 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rotY: { value: -1.57, min: -Math.PI, max: Math.PI, step: 0.01 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, posZ]}
      rotation={[rotX, rotY, rotZ]}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />

      {/* ✅ Button gắn trên mặt mesh (TV) */}
      <Html
        position={[width / 2 - 0.5, -height / 2 + 0.4, 0.01]} // góc phải dưới
        transform
        occlude
      >
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % imagePaths.length)}
          style={{
            padding: '2px 2px',
            background: '#111',
            color: '#fff',
            fontSize: '4px',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s',
          }}
          onPointerOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onPointerOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ⏭️ Next Image
        </button>
      </Html>
    </mesh>
  )
}

export default Television2
