import React, { createContext, useContext, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ✅ Định nghĩa interface cho Context
interface ViewCubeContextProps {
  toggleCameraMode: () => void;
  setCamera: (camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, controls: OrbitControls) => void;
  isPerspective: boolean;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
  controls: OrbitControls | null;
}

// ✅ Tạo Context
const ViewCubeContext = createContext<ViewCubeContextProps | null>(null);

// ✅ Provider để quản lý camera & controls
export const ViewCubeProvider2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  const [isPerspective, setIsPerspective] = useState(true);

  // ✅ Lưu camera và controls vào context
  const setCamera = useCallback((camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, controls: OrbitControls) => {
    console.log("🔄 Updating Camera and Controls in Context...");
    cameraRef.current = camera;
    controlsRef.current = controls;
  }, []);

  // ✅ Toggle giữa Perspective và Orthographic Camera
  
  const toggleCameraMode = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
  
    const previousPosition = cameraRef.current.position.clone();
    const previousTarget = controlsRef.current.target.clone();
  
    console.log("🔄 Switching Camera Mode... Previous Position:", previousPosition, " Target:", previousTarget);
  
    let newCamera;
    if (!isPerspective) {
      console.log("🔁 Switching to Orthographic Camera...");
      const aspect = window.innerWidth / window.innerHeight;
      newCamera = new THREE.OrthographicCamera(
        -5 * aspect, 5 * aspect, 5, -5, 0.1, 100
      );
    } else {
      console.log("🔁 Switching to Perspective Camera...");
      newCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    }
  
    newCamera.position.copy(previousPosition);
    newCamera.lookAt(previousTarget);
    newCamera.updateProjectionMatrix();
  
    cameraRef.current = newCamera;
  
    // ✅ Xóa control cũ và gán lại camera mới
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    const newControls = new OrbitControls(newCamera, renderer.domElement);
    newControls.target.copy(previousTarget);
    newControls.update();
    newControls.enableRotate = true; // ✅ Đảm bảo có thể xoay được
  
    controlsRef.current = newControls;
  
    setIsPerspective(!isPerspective);
    setCamera(newCamera, newControls);
  
  
    // ✅ Ép cập nhật lại Scene ngay lập tức
    window.dispatchEvent(new Event("updateScene"));
  }, [isPerspective, setCamera]);
  
  
  
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
  
  
  
  return (
    <ViewCubeContext.Provider value={{ resetView, setCamera, toggleCameraMode, isPerspective, camera: cameraRef.current, controls: controlsRef.current }}>
      {children}
    </ViewCubeContext.Provider>
  );
};

// ✅ Hook để lấy camera từ context
export const useViewCube = () => {
  const context = useContext(ViewCubeContext);
  if (!context) {
    throw new Error("useViewCube() must be used within <ViewCubeProvider>");
  }
  return context;
};
