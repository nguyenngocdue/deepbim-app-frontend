// ✅ File: src/components/ExperienceCanvas.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RoomModel from './RoomModel'
import FakeLights from './FakeLights'
import { Suspense } from 'react'



interface ExperienceCanvasProps {
  showFakeLights: boolean;
}

const ExperienceCanvas = ({ showFakeLights }: ExperienceCanvasProps) => {
  return (
    <Canvas camera={{ position: [2, 5, 20], fov: 45 }} shadows>
        {showFakeLights && <FakeLights />}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <RoomModel />
        {
          showFakeLights && <FakeLights/>
        }
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default ExperienceCanvas