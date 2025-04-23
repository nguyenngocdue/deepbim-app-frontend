// ✅ File: src/components/FakeLights.tsx
import * as THREE from 'three'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

const FakeLights = () => {
  const { scene } = useThree()

  const {
    tvColor,
    tvStrength,
    deskColor,
    deskStrength,
    pcColor,
    pcStrength,
    nightMix,
    neutralMix,
  } = useControls('Fake Lights', {
    tvColor: '#ff115e',
    tvStrength: { value: 3.0, min: 0, max: 10, step: 0.01 },
    deskColor: '#ff6700',
    deskStrength: { value: 2.5, min: 0, max: 10, step: 0.01 },
    pcColor: '#0082ff',
    pcStrength: { value: 2.5, min: 0, max: 10, step: 0.01 },
    nightMix: { value: 0.67, min: 0, max: 1, step: 0.01 },
    neutralMix: { value: 0.0, min: 0, max: 1, step: 0.01 },
  })

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.uNightMix.value = nightMix
        child.material.uniforms.uNeutralMix.value = neutralMix

        child.material.uniforms.uLightTvColor.value.set(tvColor)
        child.material.uniforms.uLightTvStrength.value = tvStrength

        child.material.uniforms.uLightDeskColor.value.set(deskColor)
        child.material.uniforms.uLightDeskStrength.value = deskStrength

        child.material.uniforms.uLightPcColor.value.set(pcColor)
        child.material.uniforms.uLightPcStrength.value = pcStrength
      }
    })
  }, [scene, tvColor, tvStrength, deskColor, deskStrength, pcColor, pcStrength, nightMix, neutralMix])

  return null
}

export default FakeLights
