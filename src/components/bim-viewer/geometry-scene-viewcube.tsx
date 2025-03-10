import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ViewCube from "./common/ViewCube";

interface GeometrySceneViewCubeProps {
  onResetView?: (resetFn: () => void) => void;
}

const GeometrySceneViewCube: React.FC<GeometrySceneViewCubeProps> = ({ onResetView }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isReady, setIsReady] = useState(false);
  const modelRef = useRef<THREE.Object3D | null>(null); // 🛑 Thêm modelRef để lưu mô hình

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    console.log("🔥 Initializing Three.js Scene..."); // 🔍 Debug

    // 🛑 Xóa `canvas` cũ nếu có (fix lỗi render 2 lần)
    if (mountRef.current.children.length > 0) {
      mountRef.current.removeChild(mountRef.current.firstChild!);
    }

    const scene = new THREE.Scene();
    
    // ✅ Tạo Camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ✅ Tạo Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ✅ Tạo Điều Khiển (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // ✅ Thêm ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // ✅ Thêm BoxGeometry (mô hình hộp)
    const box = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // Màu xanh lá
    const mesh = new THREE.Mesh(box, material);
    scene.add(mesh);
    modelRef.current = mesh; // 🛑 Lưu lại model để sau này có thể điều khiển

    // ✅ Render Loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    setIsReady(true);

    return () => {
      console.log("🛑 Cleaning up Three.js Renderer...");
      if (renderer) {
        mountRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  // ✅ Hàm Reset View
  const resetView = () => {
    console.log("🔥 Reset View function is called!");
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    if (onResetView) {
      console.log("🔥 Passing resetView to MainView...");
      onResetView(() => resetView);
    }
  }, [onResetView]);

  return (
    <div ref={mountRef} className="relative bg-gray-900 z-10">
      {isReady && cameraRef.current && rendererRef.current && controlsRef.current && modelRef.current && (
        <ViewCube 
          camera={cameraRef.current}
          renderer={rendererRef.current}
          controls={controlsRef.current}
          model={modelRef.current} // ✅ Truyền model vào ViewCube nếu cần
        />
      )}
    </div>
  );
};

export default GeometrySceneViewCube;
