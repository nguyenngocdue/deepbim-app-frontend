// ✅ File: src/components/FakeLights.tsx
import * as THREE from 'three'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

const FakeLights = () => {
  const { scene } = useThree()
  const config = { collapsed: true }
  const {
    enabled,
    tvColor,
    tvStrength,
    deskColor,
    deskStrength,
    pcColor,
    pcStrength,
    nightMix,
    neutralMix,
  } = useControls('Fake Lights', {
    enabled: true,
    tvColor: '#22bbc7',
    tvStrength: { value: 3.0, min: 0, max: 10, step: 0.01 },
    deskColor: '#ff6700',
    deskStrength: { value: 2.5, min: 0, max: 10, step: 0.01 },
    pcColor: '#0082ff',
    pcStrength: { value: 2.5, min: 0, max: 10, step: 0.01 },
    nightMix: { value: 0.67, min: 0, max: 1, step: 0.01 },
    neutralMix: { value: 0.0, min: 0, max: 1, step: 0.01 },
  }, config)

  useEffect(() => {
    if (!enabled) return

    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.ShaderMaterial &&
        child.material.uniforms
      ) {
        const uniforms = child.material.uniforms

        if (
          uniforms.uNightMix &&
          uniforms.uNeutralMix &&
          uniforms.uLightTvColor &&
          uniforms.uLightTvStrength &&
          uniforms.uLightDeskColor &&
          uniforms.uLightDeskStrength &&
          uniforms.uLightPcColor &&
          uniforms.uLightPcStrength
        ) {
          uniforms.uNightMix.value = nightMix
          uniforms.uNeutralMix.value = neutralMix

          uniforms.uLightTvColor.value.set(tvColor)
          uniforms.uLightTvStrength.value = tvStrength

          uniforms.uLightDeskColor.value.set(deskColor)
          uniforms.uLightDeskStrength.value = deskStrength

          uniforms.uLightPcColor.value.set(pcColor)
          uniforms.uLightPcStrength.value = pcStrength
        }
      }
    })
  }, [enabled, scene, tvColor, tvStrength, deskColor, deskStrength, pcColor, pcStrength, nightMix, neutralMix])

  return null
}

export default FakeLights
