import React, { createContext, useContext, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface CameraContextProps {
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  resetView: () => void;
}

const CameraContext = createContext<CameraContextProps>({
  camera: null,
  controls: null,
  resetView: () => {},
});

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <CameraContext.Provider value={{ camera: cameraRef.current, controls: controlsRef.current, resetView }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);
