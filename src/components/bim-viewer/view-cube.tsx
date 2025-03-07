import React, { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

const ViewCube: React.FC = () => {
  // Reference to the div where Three.js will be mounted
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // State to prevent re-initialization
  const [initialized, setInitialized] = useState(false);

  // Function to initialize Three.js
  const initThreeJS = () => {
    if (!mountRef.current || initialized) return; // Prevent duplicate initialization

    setInitialized(true); // Mark as initialized

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 8);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Append renderer to the DOM
    mountRef.current.appendChild(renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Initialize OrbitControls & ViewportGizmo
    const gizmo = new ViewportGizmo(camera, renderer, { type: "cube" });
    const controls = new OrbitControls(camera, renderer.domElement);
    gizmo.attachControls(controls);

    // Set camera target
    camera.lookAt(gizmo.target);

    // Animation loop
    const animate = () => {
      cube.rotation.x += 0.01; // Rotate cube
      cube.rotation.y += 0.01;

      renderer.render(scene, camera); // Render scene
      gizmo.render(); // Render gizmo
      requestAnimationFrame(animate); // Continue animation loop
    };

    animate();
  };

  return (
    <div
      ref={(ref) => {
        mountRef.current = ref; // Assign ref to mount div
        if (ref) initThreeJS(); // Initialize Three.js only when ref is assigned
      }}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default ViewCube;
