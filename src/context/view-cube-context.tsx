import React, { createContext, useContext, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeContextProps {
  resetView: () => void;
  setCamera: (camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => void;
}

const ViewCubeContext = createContext<ViewCubeContextProps | null>(null);

export const ViewCubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  // ✅ Global function to set the camera
  const setCamera = useCallback((camera: THREE.PerspectiveCamera, controls: OrbitControls, model: THREE.Object3D | null) => {
    // console.log("🔄 Updating Camera in Context...");
    cameraRef.current = camera;
    controlsRef.current = controls;
    modelRef.current = model;
  }, []);

  // ✅ Global reset function - can be called from anywhere
  const resetView = useCallback(() => {
    // console.log("🔥 Calling resetView()");
    if (cameraRef.current && controlsRef.current) {
    //   console.log("✅ Resetting camera & controls...");
      cameraRef.current.position.set(5, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      if (modelRef.current) {
        // console.log("🔄 Resetting model rotation...");
        modelRef.current.rotation.set(0, 0, 0);
      }
    } else {
      console.warn("⚠️ resetView() cannot execute because the camera or controls have not been set!");
    }
  }, []);

  return (
    <ViewCubeContext.Provider value={{ resetView, setCamera }}>
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
