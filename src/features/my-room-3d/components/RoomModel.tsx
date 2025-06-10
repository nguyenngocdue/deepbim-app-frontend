// ✅ File: src/components/RoomModel.tsx
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import TopChair from './TopChair'
import CoffeeSteam from './CoffeeSteam'
import Experience from './utils/Experience'
import { useShaderMaterial } from './utils/ShaderMaterial'
import { useRoomModelControls } from './RoomModelControls'
import PcScreen from './PcScreen'
import MacScreen from './MacScreen'
import Television from './Television'

const RoomModel = () => {
  const room = useGLTF('/my-room-3d/assets/roomModel.glb')
  const elgatoLight = useGLTF('/my-room-3d/assets/elgatoLightModel.glb')
  const googleLeds = useGLTF('/my-room-3d/assets/googleHomeLedsModel.glb')
  const loupedeck = useGLTF('/my-room-3d/assets/loupedeckButtonsModel.glb')

  const groupRef = useRef<THREE.Group>(null)
  const [introProgress, setIntroProgress] = useState(0)

  // ✅ Áp dụng ShaderMaterial cho room
  useEffect(() => {
    room.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = useShaderMaterial()
      }
    })
  }, [room.scene])

  // ✅ Dùng controls đã tách
  const { xoy, xoz, yoz, posX, posY, posZ } = useRoomModelControls()
  const sliceSpeed = 0.0015;

  // ✅ Slide-in animation từ giữa và dừng lại ở vị trí target (hiệu ứng hiện từ từ cả vị trí + opacity)
  const materialOpacity = useRef(0)
  useFrame(() => {
    if (groupRef.current) {
      setIntroProgress((p) => Math.min(p + sliceSpeed, 1))
      const easedProgress = 1 - Math.pow(1 - introProgress, 7) // ⬅ Cập nhật thành ease-out quintic (mượt hơn)

      const initialX = 0
      groupRef.current.position.x = THREE.MathUtils.lerp(initialX, posX, easedProgress)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, posY, 0.05)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, posZ, 0.05)
      const euler = new THREE.Euler(xoy, yoz, xoz, 'XYZ')
      groupRef.current.rotation.copy(euler)

      // Opacity fade-in effect
      if (materialOpacity.current < 1) {
        materialOpacity.current = Math.min(materialOpacity.current + 0.01, 1)
        groupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material instanceof THREE.Material) {
            ((child as THREE.Mesh).material as THREE.Material).transparent  = true;
            ((child as THREE.Mesh).material as THREE.Material).opacity  = materialOpacity.current
          }
        })
      }
    }
  })

  const time = new Experience().time

  return (
    <group ref={groupRef} name="room" position={[0, posY, posZ]}>
      <primitive object={room.scene} />
      <PcScreen/>
      <MacScreen/>
      <TopChair time={time} />
      <CoffeeSteam time={time} />
      <primitive object={elgatoLight.scene} position={[1.0, 1.1, -1.5]} />
      <primitive object={googleLeds.scene} position={[-0.5, 0.95, -0.8]} />
      <primitive object={loupedeck.scene} position={[0.2, 0.85, -1.0]} />
      {/* <MultiImageScreens/> */}
      <Television/>
    </group>
  )
}

export default RoomModel