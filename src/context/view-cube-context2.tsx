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
  
    const previousPosition = cameraRef.current.position.clone(); // ✅ Lưu vị trí camera cũ
    const previousTarget = controlsRef.current.target.clone();  // ✅ Lưu điểm camera đang nhìn vào
    console.log("🔄 Switching Camera Mode... Previous Position:", previousPosition, " Target:", previousTarget);
  
    let newCamera;
    if (isPerspective) {
      console.log("🔁 Switching to Orthographic Camera...");
      const aspect = window.innerWidth / window.innerHeight;
      newCamera = new THREE.OrthographicCamera(
        -5 * aspect, 5 * aspect, 5, -5, 0.1, 100
      );
    } else {
      console.log("🔁 Switching to Perspective Camera...");
      newCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    }
  
    newCamera.position.copy(previousPosition);  // ✅ Giữ nguyên vị trí
    newCamera.lookAt(previousTarget);           // ✅ Giữ nguyên điểm đang nhìn vào
    newCamera.updateProjectionMatrix();
  
    cameraRef.current = newCamera;
  
    // ✅ Xóa control cũ và gán lại camera mới
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
  
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) {
      console.error("🚨 Không tìm thấy canvas!");
      return;
    }
  
    const newControls = new OrbitControls(newCamera, canvas);
    newControls.target.copy(previousTarget); // ✅ Giữ nguyên điểm đang nhìn vào
    newControls.update();
  
    controlsRef.current = newControls;
  
    setIsPerspective(!isPerspective);
    setCamera(newCamera, newControls);
  
    // ✅ Ép cập nhật lại Scene ngay lập tức
    window.dispatchEvent(new Event("updateScene"));
  }, [isPerspective, setCamera]);
  
  
  
  
  
  return (
    <ViewCubeContext.Provider value={{ setCamera, toggleCameraMode, isPerspective, camera: cameraRef.current, controls: controlsRef.current }}>
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
