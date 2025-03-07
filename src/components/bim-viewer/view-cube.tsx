import React, { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

const ViewCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Hàm khởi tạo Three.js
  const initThreeJS = () => {
    if (!mountRef.current || initialized) return; // Nếu đã init thì không làm lại

    setInitialized(true); // Đánh dấu đã khởi tạo

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Tạo Cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Khởi tạo OrbitControls & Gizmo
    const gizmo = new ViewportGizmo(camera, renderer, { type: "cube" });
    const controls = new OrbitControls(camera, renderer.domElement);
    gizmo.attachControls(controls);

    camera.lookAt(gizmo.target);

    // Vòng lặp animation
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      gizmo.render();
      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <div
      ref={(ref) => {
        mountRef.current = ref;
        if (ref) initThreeJS(); // Chỉ chạy init khi ref có giá trị
      }}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default ViewCube;
