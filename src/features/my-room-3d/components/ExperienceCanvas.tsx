// ✅ File: src/components/ExperienceCanvas.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RoomModel from './RoomModel'
import FakeLights from './FakeLights'
import { Suspense } from 'react'

const ExperienceCanvas = () => {
  return (
    <Canvas camera={{ position: [2, 5, 20], fov: 45 }} shadows>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <RoomModel />
        <FakeLights />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default ExperienceCanvas