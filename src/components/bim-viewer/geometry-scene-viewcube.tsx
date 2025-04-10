import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useViewCube } from "@/context/view-cube-context2";
import ViewCube from "./common/ViewCube";

const GeometrySceneViewCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const  modelRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);


  const { setCamera, camera, controls } = useViewCube();

  /** 🔥 Khởi tạo Scene */
  const initScene = () => {
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
    }
  };

  /** 📷 Khởi tạo Camera */
  const initCamera = (renderer: THREE.WebGLRenderer) => {
    let activeCamera = camera;

    if (!activeCamera) {
      console.log("📷 Creating default Perspective Camera...");
      activeCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
      activeCamera.position.set(5, 5, 10);
    }

    if (!controls) {
      console.log("🛠 Creating new OrbitControls...");
      const newControls = new OrbitControls(activeCamera, renderer.domElement);
      newControls.target.set(0, 0, 0);
      newControls.update();
      controlsRef.current = newControls;

      setCamera(activeCamera, newControls);
    }

    return activeCamera;
  };

  /** 🎥 Khởi tạo Renderer */
  const initRenderer = () => {
    if (!mountRef.current || rendererRef.current) return null;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    return renderer;
  };

  /** 🏗️ Khởi tạo Model */
  const initModel = (scene: THREE.Scene) => {
    if (!modelRef.current) {
      const boxGeometry = new THREE.BoxGeometry(20, 2, 2);
      const material = new THREE.MeshPhongMaterial({ color: "#6fa8dc" });
      const boxMesh = new THREE.Mesh(boxGeometry, material);
      scene.add(boxMesh);
      modelRef.current = boxMesh;
    }
  };

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    console.log("🔥 Initializing Three.js Scene...");

    initScene();
    const renderer = initRenderer();
    if (!renderer) return;

    const scene = sceneRef.current!;
    const activeCamera = initCamera(renderer);
    setCamera(activeCamera, controls || new OrbitControls(activeCamera, renderer.domElement));
    cameraRef.current = activeCamera;

    initModel(scene);

    /** 🔄 Render Scene */
    const renderScene = () => {
      requestAnimationFrame(renderScene);
      controls?.update();
      if (rendererRef.current) rendererRef.current.render(scene, activeCamera);
    };
    renderScene();

    /** 📢 Lắng nghe sự kiện cập nhật Scene */
    const handleUpdateScene = () => {
      console.log("🔄 Scene Updated!");
      if (rendererRef.current && camera) {
        camera.updateProjectionMatrix();
        rendererRef.current.render(scene, camera);
      }
    };
    window.addEventListener("updateScene", handleUpdateScene);

    setIsReady(true);

    return () => {
      console.log("🛑 Cleaning up Scene...");
      window.removeEventListener("updateScene", handleUpdateScene);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!camera || !controls || !rendererRef.current || !sceneRef.current) return;
    
    controls.object = camera; // ✅ Cập nhật camera mới cho controls
    controls.update();
    controlsRef.current = controls;
  
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      rendererRef.current?.render(sceneRef.current!, camera);
    };
    animate();
  }, [camera]);
  

  return <div ref={mountRef} className="relative bg-gray-900 z-10">
          {/* {isReady && cameraRef.current && rendererRef.current && controlsRef.current && (
          <ViewCube 
            camera={cameraRef.current}
            renderer={rendererRef.current}
            controls={controlsRef.current}
            model={modelRef.current} // Pass the model reference
          />
        )} */}
  </div>;
};

export default GeometrySceneViewCube;
