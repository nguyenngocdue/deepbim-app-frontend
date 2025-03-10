import { useViewCube } from "@/context/view-cube-context";
import { useEffect, useRef } from "react";
import { FaHome } from "react-icons/fa";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeProps {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  model: THREE.Object3D;
}

const ViewCube: React.FC<ViewCubeProps> = ({ camera, renderer, controls, model }) => {
  const { resetView, setCamera } = useViewCube(); // ✅ Gọi resetView() từ Context
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("✅ ViewCube Mounted - Đăng ký Camera vào Context...");
    setCamera(camera, controls, model);
  }, [camera, controls, model, setCamera]);

  useEffect(() => {
    const gizmo = new ViewportGizmo(camera, renderer, {
      type: "cube",
      position: "top-right",
      style: { transform: "translateY(10px)" },
      background: { color: "rgba(255, 255, 255, 0)" },
    });

    gizmo.attachControls(controls);

    camera.lookAt(0, 0, 0);
    controls.update();

    const animate = () => {
      gizmo.render();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    gizmo.onRotate = (rotation: THREE.Quaternion) => {
      if (model) {
        model.setRotationFromQuaternion(rotation);
      }
    };

    return () => {
      gizmo.dispose();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [camera, renderer, controls, model]);

  return (
    <>
      <button
        onClick={() => {
          console.log("🛠 Gọi resetView() từ ViewCube");
          resetView();
        }}
        className="z-20 absolute top-[15px] right-[140px] bg-transparent border-none shadow-none text-white p-3 text-2xl hover:text-gray-300 transition"
      >
        <FaHome />
      </button>
    </>
  );
};

export default ViewCube;
