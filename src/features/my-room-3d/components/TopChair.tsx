// ✅ File: src/components/TopChair.tsx
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useMemo } from 'react';
import { Group } from 'three';
import Time from './utils/Time';
import * as THREE from 'three';
import { useShaderMaterial } from './utils/ShaderMaterial';

interface TopChairProps {
    time: Time
}

const TopChair = ({ time }: TopChairProps) => {
    const topChair = useGLTF('/my-room-3d/assets/topChairModel.glb')
    const wrapperRef = useRef<Group>(topChair.scene.children[0] as Group)
    

    useEffect(() => {
        const update = () => {
            if (wrapperRef.current) {
                wrapperRef.current.rotation.y = Math.sin(time.elapsed * 0.0005) * 0.9
            }
        }

        time.on('tick', update)
        return () => {
            time.off('tick')
        }
    }, [time])

    if (wrapperRef.current) {
        wrapperRef.current.traverse((_child) => {
            if (_child instanceof THREE.Mesh) {
                _child.material = useShaderMaterial();
            }
        });
    }


    return (
        <primitive object={topChair.scene} />
    )
}

export default TopChair