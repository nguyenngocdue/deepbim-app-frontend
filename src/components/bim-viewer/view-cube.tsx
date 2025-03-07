import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

const ViewCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null); // Prevent duplicate renderers

  // Function to initialize Three.js
  const initThreeJS = () => {
    if (!mountRef.current || rendererRef.current) return; // Prevent duplicate initialization

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 8);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer; // Store renderer reference

    mountRef.current.appendChild(renderer.domElement); // Attach only once

    // Create a cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Initialize OrbitControls & ViewportGizmo
    const gizmo = new ViewportGizmo(camera, renderer, { type: "cube" });
    const controls = new OrbitControls(camera, renderer.domElement);
    gizmo.attachControls(controls);

    camera.lookAt(gizmo.target);

    // Animation loop
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
        if (ref && !rendererRef.current) {
          mountRef.current = ref;
          initThreeJS(); // Initialize only if not already initialized
        }
      }}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default ViewCube;
