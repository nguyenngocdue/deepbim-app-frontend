import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";

// Configure Viewport Gizmo style with bold dashed borders
function getGizmoConfig() {
  return {
    type: "cube",
    background: { color: "#CCCCCC" }, // Dark background for contrast
    corners: {
      color: '#6FA8DC', // Darker gray corners
      labelColor: 0xffffff, // White text
    },
    edges: {
      color: 0x00ff00, // Green edges
      labelColor: "#134E15", // Black text
      lineStyle: "dashed", // Dashed border effect
      lineWidth: 3, // Bold lines
      dashSize: 8, // Dash length
      gapSize: 4, // Space between dashes
    },
    right: {
      color: 0xffffff, // White face
      labelColor: "#134E15", // Black text
    },
    top: {
      color: 0xffffff,
      labelColor: "#134E15",
    },
    front: {
      color: 0xffffff,
      labelColor: "#134E15",
    },
    bottom: {
      color: 0x999999, // Slightly darker gray to simulate shadow
      labelColor: "#134E15",
    },
  };
}


const ViewCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Function to initialize Three.js
  const initThreeJS = () => {
    if (!mountRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 10);

    // Create renderer with shadows enabled
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create the main cube (solid white)
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Add dashed green edges
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const dashedMaterial = new THREE.LineDashedMaterial({
      color: 0x00ff00, // Green color
      linewidth: 2,
      scale: 1,
      dashSize: 0.3, // Dash length
      gapSize: 0.15, // Gap between dashes
    });
    const dashedLines = new THREE.LineSegments(edges, dashedMaterial);
    dashedLines.computeLineDistances(); // Necessary for dashed effect
    scene.add(dashedLines);

    // Create a ground plane to catch shadows
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.5;
    plane.receiveShadow = true;
    scene.add(plane);

    // Add lighting for shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add text labels
    const createTextTexture = (text: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 256;
      canvas.height = 256;

      // Draw background
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      context.fillStyle = "black";
      context.font = "bold 48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      return new THREE.CanvasTexture(canvas);
    };

    // Apply textures with labels
    const labeledMaterials = [
      new THREE.MeshStandardMaterial({ map: createTextTexture("RIGHT") }), 
      new THREE.MeshStandardMaterial({ map: createTextTexture("LEFT") }), 
      new THREE.MeshStandardMaterial({ map: createTextTexture("TOP") }), 
      new THREE.MeshStandardMaterial({ map: createTextTexture("BOTTOM") }), 
      new THREE.MeshStandardMaterial({ map: createTextTexture("FRONT") }), 
      new THREE.MeshStandardMaterial({ map: createTextTexture("BACK") }), 
    ];
    cube.material = labeledMaterials;

    // Initialize OrbitControls & ViewportGizmo
    const gizmo = new ViewportGizmo(camera, renderer, getGizmoConfig());
    const controls = new OrbitControls(camera, renderer.domElement);
    gizmo.attachControls(controls);

    camera.lookAt(gizmo.target);

    // Animation loop
    const animate = () => {
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
          initThreeJS();
        }
      }}
      style={{ width: "100vw", height: "100vh", background: "#222222" }} // Dark background
    />
  );
};

export default ViewCube;
