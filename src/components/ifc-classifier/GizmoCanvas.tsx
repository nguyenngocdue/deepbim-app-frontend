import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

type GizmoCanvasProps = {
    mainCameraRef: React.RefObject<THREE.Camera>
}

export function GizmoCanvas({ mainCameraRef }: GizmoCanvasProps) {

    function SyncCamera() {
        const { camera } = useThree()

        useFrame(() => {
            const main = mainCameraRef.current
            if (main && main.position && main.quaternion) {
                camera.position.copy(main.position)
                camera.quaternion.copy(main.quaternion)
                camera.updateMatrixWorld()
            }
        })


        return null
    }

    return (
        <Canvas
            camera={{ position: [100, 100, 5], fov: 50 }}
            gl={{ alpha: true }}
            style={{
                position: 'absolute',
                top: 200,
                right: 100,
                width: 200,
                height: 200,
                pointerEvents: 'none',
                zIndex: 50,
            }}
        >
            {/* Sync gizmo camera với main camera */}
            <SyncCamera />
            <axesHelper args={[5]} />
            <OrbitControls makeDefault enableDamping={false} />
            <GizmoHelper alignment="center" margin={[80, 80]}>
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
        </Canvas>
    )
}
