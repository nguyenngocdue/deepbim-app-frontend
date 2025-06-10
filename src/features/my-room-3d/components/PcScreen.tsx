// ✅ File: src/components/PcScreen.tsx
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const PcScreen = () => {
  const pcScreen  = useGLTF('/my-room-3d/assets/pcScreenModel.glb');
  const wrapperRef = useRef<THREE.Group>(pcScreen.scene.children[0] as THREE.Group)
  

  const videoElement = useMemo(() => Object.assign(document.createElement('video'), {
    src: 'https://minio.deepbim.net:9000/deepbim-fe/1749523330397-Sign-in.mp4',
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    autoplay: true,
    playsInline: true,
  }), [])

  const videoTexture = useMemo(() => new THREE.VideoTexture(videoElement), [videoElement])
  const videoMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    map: videoTexture,
    toneMapped: false,
  }), [videoTexture])

  useEffect(() => {
    videoElement.load()
    videoElement.play().catch(console.warn)

    wrapperRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = videoMaterial;
        }
    })
  }, [pcScreen, videoElement, videoMaterial])

  return <primitive object={pcScreen.scene} />
}

export default PcScreen
