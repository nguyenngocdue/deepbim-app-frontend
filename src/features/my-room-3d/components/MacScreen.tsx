// ✅ File: src/components/MacScreen.tsx
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

const MacScreen = () => {
  const macScreen = useGLTF('/my-room-3d/assets/macScreenModel.glb');
  const wrapperRef = useRef<THREE.Group>(macScreen.scene.children[0] as THREE.Group)

  // ✅ Load ảnh gif dưới dạng texture
  const gifTexture = useLoader(THREE.TextureLoader, '/my-room-3d/assets/BaiViet.jfif')

  const gifMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    map: gifTexture,
    toneMapped: false,
  }), [gifTexture])

  useEffect(() => {
    wrapperRef.current.traverse((child) => {
        (child as THREE.Mesh).material = gifMaterial
    })
  }, [gifMaterial])

  return <primitive object={macScreen.scene} />
}

export default MacScreen
