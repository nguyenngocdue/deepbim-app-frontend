import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ViewportGizmo } from "three-viewport-gizmo";
import { FaHome } from "react-icons/fa";

function getGizmoConfig() {
  return {
    type: "cube",
    position: "bottom-left", // Change position of Gizmo (Try "top-left", "top-right", etc.)
    style: { transform: "translateY(10px)"}, // Move down by 10px
    background: { color: "rgba(255, 255, 255, 0)" }, // Transparent Background

    corners: {
      color: "#98C1D9",
      labelColor: "#FFFFFF",
      hover: { color: "#3D5A80", labelColor: "#000000" },
    },
    edges: {
      color: "#A8DADC",
      labelColor: "#1D3557",
      lineStyle: "dashed",
      lineWidth: 3,
      dashSize: 8,
      gapSize: 4,
      hover: { color: "#457B9D", labelColor: "#F1FAEE" },
    },
    right: { color: "#E9F5DB", labelColor: "#1D3557", hover: { color: "#A8DADC", labelColor: "#000000" } },
    top: { color: "#F1FAEE", labelColor: "#1D3557", hover: { color: "#A8DADC", labelColor: "#000000" } },
    front: { color: "#E9F5DB", labelColor: "#1D3557", hover: { color: "#A8DADC", labelColor: "#000000" } },
    bottom: { color: "#D9E2EC", labelColor: "#1D3557", hover: { color: "#B0C4DE", labelColor: "#FFFFFF" } },
  };
}


const ViewCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gizmoRef = useRef<ViewportGizmo | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Initialize Three.js with Geometry Cube
  const initThreeJS = () => {
    if (!mountRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create Main Cube (Geometry)
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

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

    // Add Dashed Green Edges
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const dashedMaterial = new THREE.LineDashedMaterial({
      color: 0x00ff00, // Green color
      linewidth: 2,
      scale: 1,
      dashSize: 0.3,
      gapSize: 0.15,
    });
    const dashedLines = new THREE.LineSegments(edges, dashedMaterial);
    dashedLines.computeLineDistances();
    scene.add(dashedLines);

    // Create Ground Plane for Shadows
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3;
    plane.receiveShadow = true;
    scene.add(plane);

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add Viewport Gizmo
    const gizmo = new ViewportGizmo(camera, renderer, getGizmoConfig());
    gizmoRef.current = gizmo;
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    gizmo.attachControls(controls);

    camera.lookAt(gizmo.target);

    const animate = () => {
      cube.rotation.y += 0.01; // Rotating Cube
      dashedLines.rotation.y += 0.01; // Keep edges rotating

      renderer.render(scene, camera);
      gizmo.render();
      requestAnimationFrame(animate);
    };

    animate();

    setTimeout(() => {
      const gizmoElement = document.querySelector(".viewport-gizmo");
      if (gizmoElement) {
        gizmoElement.setAttribute("style", "position: absolute; bottom: 10px; right: 20px; transform: translateY(10px);");
      }
    }, 500);
  };

  // Reset View to Default
  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      gizmoRef.current?.render();
    }
  };

  return (
    <>
      <div
        ref={(ref) => {
          if (ref && !rendererRef.current) {
            mountRef.current = ref;
            initThreeJS();
          }
        }}
        className="relative w-screen h-screen bg-gray-900"
      >
        {/* House Button to the Left of Gizmo */}
        <button
          onClick={resetView}
          className="absolute top-[15px] right-[200px] bg-transparent border-none shadow-none text-white p-3 text-2xl hover:text-gray-300 transition"
        >
          <FaHome />
        </button>
      </div>
    </>

  );
};

export default ViewCube;
