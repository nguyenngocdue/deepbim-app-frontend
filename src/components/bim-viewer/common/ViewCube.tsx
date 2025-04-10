// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { ViewportGizmo } from "three-viewport-gizmo";
// import { FaHome } from "react-icons/fa";

// interface ViewCubeProps {
//   model: THREE.Object3D; // ✅ Chỉ truyền vào model
// }

// const ViewCube: React.FC<ViewCubeProps> = ({ camera, renderer, controls, model }) => {
  
//   const mountRef = useRef<HTMLDivElement | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const gizmoRef = useRef<ViewportGizmo | null>(null);
//   const controlsRef = useRef<OrbitControls | null>(null);
//   // ✅ Hàm khởi tạo Gizmo (Không tạo Scene mới)
//   const initGizmo = () => {
    
//     if (!mountRef.current || rendererRef.current) return;
//     camera.position.set(5, 5, 10);
    
  
//     // ✅ Renderer riêng cho Gizmo
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     rendererRef.current = renderer;
//     mountRef.current.appendChild(renderer.domElement);
    
  
//     // ✅ Khởi tạo Gizmo
//     const gizmo = new ViewportGizmo(camera, renderer, {
//       type: "cube",
//       background: { color: "rgba(255, 255, 255, 0.2)" },
//     });

//     // ✅ Xóa control cũ và gán lại camera mới
    
//     gizmoRef.current = gizmo;
//     const controls = new OrbitControls(camera, renderer.domElement);
//     gizmoRef.current = gizmo;
//     gizmo.attachControls(controls);

  
//     // ✅ Animation loop
//     const animate = () => {
//       gizmo.render();
//       controls.update()
//       requestAnimationFrame(animate);
//     };
//     animate();
//   };
//   useEffect(() => {
//       initGizmo();
//   }, [camera, renderer, controls, model ])

//   useEffect(() => {
//     if (gizmoRef.current && controlsRef.current) {
//       gizmoRef.current.attachControls(controlsRef.current);
//       gizmoRef.current.onRotate = (rotation: THREE.Quaternion) => {
//         model.setRotationFromQuaternion(rotation);
//       };
//     }
//   }, [camera, controls]);
  

//   // ✅ Reset Camera về góc nhìn ban đầu
//   const resetView = () => {
//     if (cameraRef.current && controlsRef.current) {
//       cameraRef.current.position.set(3, 3, 3);
//       cameraRef.current.lookAt(0, 0, 0);
//       controlsRef.current.target.set(0, 0, 0);
//       controlsRef.current.update();
//       gizmoRef.current?.render();
//     }
//   };

//   return (
//     <>
//       <div
//         ref={(ref) => {
//           if (ref && !rendererRef.current) {
//             mountRef.current = ref;
//           }
//         }}
//         className="z-50 absolute top-[15px] right-[50px] w-full h-full bg-transparent"
//       ></div>

//       {/* House Button to Reset View */}
//       <button
//         onClick={resetView}
//         className="absolute z-50 top-[15px] right-[150px] bg-transparent border-none shadow-none text-white p-3 text-2xl hover:text-gray-300 transition"
//       >
//         <FaHome />
//       </button>
//     </>
//   );
// };

// export default ViewCube;
