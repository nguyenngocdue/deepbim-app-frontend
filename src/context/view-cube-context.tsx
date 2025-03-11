import React, { createContext, useContext, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeContextProps {
    resetView: () => void;
    setCamera: (camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => void;
    isPerspective: boolean;
}

const ViewCubeContext = createContext<ViewCubeContextProps | null>(null);

export const ViewCubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);

    const setCamera = useCallback((camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => {
        console.log("🔄 Updating Camera in Context...", { camera, controls, model });
        cameraRef.current = camera;
        controlsRef.current = controls;
        modelRef.current = model;
    }, []);
    

    const resetView = useCallback(() => {
        console.log("🔥 Calling resetView()");
    
        if (!cameraRef.current || !controlsRef.current) {
            console.error("❌ Camera or Controls is not available! Did `setCamera()` run?");
            return;
        }
    
        console.log("✅ Resetting camera & controls...");
        cameraRef.current.position.set(5, 5, 10);
        cameraRef.current.lookAt(0, 0, 0);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
    
        if (modelRef.current) {
            console.log("🔄 Resetting model rotation...");
            modelRef.current.rotation.set(0, 0, 0);
        }
    }, []);
    
    


    const [isPerspective, setIsPerspective] = useState(true);

    return (
        <ViewCubeContext.Provider value={{ resetView, setCamera, isPerspective }}>
            {children}
        </ViewCubeContext.Provider>
    );

};

export const useViewCube = () => {
    const context = useContext(ViewCubeContext);
    if (!context) {
        throw new Error("useViewCube() must be used within <ViewCubeProvider>");
    }
    return context;
};
