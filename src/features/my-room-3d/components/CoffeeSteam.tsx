// ✅ File: src/components/CoffeeSteam.tsx
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// @ts-ignore
import vertexShader from './shaders/coffeeSteam/vertex.glsl?raw';
// @ts-ignore
import fragmentShader from './shaders/coffeeSteam/fragment.glsl?raw';
import { useCoffeeSteamControls } from './CoffeeSteamControls';

const CoffeeSteam = ({ time }: any) => {
  const { scene } = useGLTF('/my-room-3d/assets/coffeeSteamModel.glb')
  const mesh = scene.children[0] as THREE.Mesh
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const { visible, color, uTimeFrequency, uUvX, uUvY } = useCoffeeSteamControls()

  const steamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTimeFrequency: { value: uTimeFrequency },
        uUvFrequency: { value: new THREE.Vector2(uUvX, uUvY) },
        uColor: { value: new THREE.Color(color) },
      },
    })
  }, [])

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTimeFrequency.value = uTimeFrequency
      materialRef.current.uniforms.uUvFrequency.value.set(uUvX, uUvY)
      materialRef.current.uniforms.uColor.value.set(color)
    }
  }, [color, uTimeFrequency, uUvX, uUvY])

  useEffect(() => {
    mesh.material = steamMaterial
    materialRef.current = steamMaterial
  }, [mesh, steamMaterial])

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time.elapsed
    }
  })

  if (!visible) return null

  return <primitive object={scene} />
}

export default CoffeeSteam;