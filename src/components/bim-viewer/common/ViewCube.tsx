import { useEffect, useRef } from "react";
import { FaHome } from "react-icons/fa";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeProps {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

const  getGizmoConfig = {
    type: "cube" as const,
    position: "bottom-left", // Change position of Gizmo (Try "top-left", "top-right", etc.)
    style: { transform: "translateY(10px)" }, // Move down by 10px
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
}

const ViewCube: React.FC<ViewCubeProps> = ({ camera, renderer, controls }) => {
  const gizmoRef = useRef<ViewportGizmo | null>(null);
  const animationRef = useRef<number | null>(null); // Track animation frame

  useEffect(() => {
    if (gizmoRef.current) return; // Prevent multiple initializations

    const gizmo = new ViewportGizmo(camera, renderer, getGizmoConfig );
    gizmo.attachControls(controls);
    gizmoRef.current = gizmo;

    // Ensure camera looks at the scene center
    camera.lookAt(0, 0, 0);
    controls.update();

    const animate = () => {
      if (gizmoRef.current) gizmoRef.current.render();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (gizmoRef.current) {
        gizmoRef.current.dispose();
        gizmoRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [camera, renderer, controls]); // ✅ Include all dependencies

  const resetView = () => {
    if (camera && controls) {
      camera.position.set(5, 5, 10);
      camera.lookAt(0, 0, 0);
      controls.update();
      gizmoRef.current?.render();
    }
  };

  return (
    <>
      <button
        onClick={resetView}
        className="absolute top-[15px] right-[140px] bg-transparent border-none shadow-none text-white p-3 text-2xl hover:text-gray-300 transition"
      >
        <FaHome />
      </button>
    </>
  );
};

export default ViewCube;
