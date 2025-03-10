import React, { createContext, useContext, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeContextProps {
    resetView: () => void;
    toggleCameraMode: () => void; // ✅ New function to switch camera mode
    setCamera: (camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => void;
    isPerspective: boolean;
}

const ViewCubeContext = createContext<ViewCubeContextProps | null>(null);

export const ViewCubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const [isPerspective, setIsPerspective] = useState(true); // ✅ Camera mode state

    const setCamera = useCallback((camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => {
        console.log("🔄 Updating Camera in Context...");
        cameraRef.current = camera;
        controlsRef.current = controls;
        modelRef.current = model;
    }, []);

    const resetView = useCallback(() => {
        console.log("🔥 Calling resetView()");
        if (cameraRef.current && controlsRef.current) {
            console.log("✅ Resetting camera & controls...");
            cameraRef.current.position.set(5, 5, 10);
            cameraRef.current.lookAt(0, 0, 0);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();

            if (modelRef.current) {
                console.log("🔄 Resetting model rotation...");
                modelRef.current.rotation.set(0, 0, 0);
            }
        } else {
            console.warn("⚠️ resetView() cannot execute because the camera or controls have not been set!");
        }
    }, []);

    // ✅ Toggle between Perspective and Orthographic Camera
    const toggleCameraMode = useCallback(() => {
        if (!cameraRef.current || !controlsRef.current) return;
      
        const currentCamera = cameraRef.current;
        const scenePosition = currentCamera.position.clone();
      
        let newCamera;
        if (isPerspective) {
          console.log("🔁 Switching to Orthographic Camera...");
          newCamera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
        } else {
          console.log("🔁 Switching to Perspective Camera...");
          newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        }
      
        // Preserve camera position & target
        newCamera.position.copy(scenePosition);
      
        // Update global camera reference
        cameraRef.current = newCamera;
      
        // 🔥 Fix: Update OrbitControls to use the new camera
        controlsRef.current.object = cameraRef.current;
        controlsRef.current.update();
      
        setIsPerspective(!isPerspective);
      }, [isPerspective]);
      

    return (
        <ViewCubeContext.Provider value={{ resetView, setCamera, toggleCameraMode, isPerspective }}>
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
