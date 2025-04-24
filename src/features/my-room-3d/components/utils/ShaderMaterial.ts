// ✅ File: src/utils/createShaderMaterial.ts
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
// @ts-ignore
import fragmentShader from '../shaders/baked/fragment.glsl?raw'
// @ts-ignore
import vertexShader from '../shaders/baked/vertex.glsl?raw'

export function useShaderMaterial(): THREE.ShaderMaterial {
  const [bakedDay, bakedNight, bakedNeutral, lightMap] = useLoader(THREE.TextureLoader, [
    '/my-room-3d/assets/bakedDay.jpg',
    '/my-room-3d/assets/bakedNight.jpg',
    '/my-room-3d/assets/bakedNeutral.jpg',
    '/my-room-3d/assets/lightMap.jpg'
  ])

  bakedDay.flipY = false
  bakedNight.flipY = false
  bakedNeutral.flipY = false
  lightMap.flipY = false

  return new THREE.ShaderMaterial({
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
  })
}