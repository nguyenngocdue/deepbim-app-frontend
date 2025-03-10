import { useEffect, useRef } from "react";
import { FaHome } from "react-icons/fa";
import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ViewCubeProps {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  model: THREE.Object3D; // 🔥 Thêm mô hình vào props để cập nhật khi xoay ViewCube
}

const getGizmoConfig = {
  type: "cube" as const,
  position: "top-right",
  style: { transform: "translateY(10px)" },
  background: { color: "rgba(255, 255, 255, 0)" },
};

const ViewCube: React.FC<ViewCubeProps> = ({ camera, renderer, controls, model }) => {
  const gizmoRef = useRef<ViewportGizmo | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (gizmoRef.current) return;

    // Tạo ViewCube
    const gizmo = new ViewportGizmo(camera, renderer, getGizmoConfig);
    gizmo.attachControls(controls);
    gizmoRef.current = gizmo;

    camera.lookAt(0, 0, 0);
    controls.update();

    // 🎯 Luôn render ViewCube
    const animate = () => {
      gizmoRef.current?.render();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 🔥 Đồng bộ mô hình khi ViewCube xoay
    gizmo.onRotate = (rotation: THREE.Quaternion) => {
      if (model) {
        model.setRotationFromQuaternion(rotation);
      }
    };

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
  }, [camera, renderer, controls]);

  /** 🔄 Reset về góc nhìn ban đầu */
  const resetView = () => {
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
    gizmoRef.current?.render();

    // 🔥 Reset quay mô hình
    if (model) {
      model.rotation.set(0, 0, 0);
    }
  };

  return (
    <>
      <button
        onClick={resetView}
        className="z-20 absolute top-[15px] right-[140px] bg-transparent border-none shadow-none text-white p-3 text-2xl hover:text-gray-300 transition"
      >
        <FaHome />
      </button>
    </>
  );
};

export default ViewCube;
