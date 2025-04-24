// ✅ File: src/components/RoomModelControls.ts
import { useControls } from 'leva'

export const useRoomModelControls = () => {
  return useControls('Room Model', {
    xoy: { value: 0.21, min: -Math.PI, max: Math.PI, step: 0.01 },
    xoz: { value: -0.15, min: -Math.PI, max: Math.PI, step: 0.01 },
    yoz: { value: 1.28, min: -Math.PI, max: Math.PI, step: 0.01 },
    posX: { value: -5.00, min: -15, max: 15, step: 0.01 },
    posY: { value: -1.53, min: -15, max: 15, step: 0.01 },
    posZ: { value: 1.11, min: -15, max: 15, step: 0.01 },
  }, { collapsed: true })
}

export default useRoomModelControls
