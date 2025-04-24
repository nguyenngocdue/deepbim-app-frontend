// ✅ File: src/components/RoomModel.tsx
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import TopChair from './TopChair'
import CoffeeSteam from './CoffeeSteam'
import Experience from './utils/Experience'
import { useShaderMaterial } from './utils/ShaderMaterial'
import { useRoomModelControls } from './RoomModelControls'

const RoomModel = () => {
  const room = useGLTF('/my-room-3d/assets/roomModel.glb')
  const pcScreen = useGLTF('/my-room-3d/assets/pcScreenModel.glb')
  const macScreen = useGLTF('/my-room-3d/assets/macScreenModel.glb')
  const elgatoLight = useGLTF('/my-room-3d/assets/elgatoLightModel.glb')
  const googleLeds = useGLTF('/my-room-3d/assets/googleHomeLedsModel.glb')
  const loupedeck = useGLTF('/my-room-3d/assets/loupedeckButtonsModel.glb')

  const groupRef = useRef<THREE.Group>(null)

  // ✅ Áp dụng ShaderMaterial cho room
  useEffect(() => {
    room.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = useShaderMaterial()
      }
    })
  }, [room.scene])

  
  // ✅ Dùng controls đã tách
  const {  xoy, xoz, yoz, posX, posY, posZ } = useRoomModelControls()

  // ✅ Cập nhật transform group theo controls
  useEffect(() => {
    if (groupRef.current) {
      const euler = new THREE.Euler(xoy, yoz, xoz, 'XYZ')
      groupRef.current.rotation.copy(euler)
      groupRef.current.position.set(posX, posY, posZ)
    }
  }, [xoy, xoz, yoz, posX, posY, posZ])

  const time = new Experience().time
  return (
    <group ref={groupRef} name="room">
      <primitive object={room.scene} />
      <primitive object={pcScreen.scene} />
      <primitive object={macScreen.scene} />
      <TopChair time={time} />
      <CoffeeSteam time={time} />
      <primitive object={elgatoLight.scene} position={[1.0, 1.1, -1.5]} />
      <primitive object={googleLeds.scene} position={[-0.5, 0.95, -0.8]} />
      <primitive object={loupedeck.scene} position={[0.2, 0.85, -1.0]} />
    </group>
  )
}

export default RoomModel