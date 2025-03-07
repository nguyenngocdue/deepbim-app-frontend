import React, { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ViewCube from "./common/ViewCube";

const GeometryScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initThreeJS = () => {
    if (!mountRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const box = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(box, material);
    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    setIsReady(true);

    return () => {
      if (renderer) {
        mountRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
        rendererRef.current = null;
      }
    };
  };

  return (
    <div
      ref={(ref) => {
        if (ref && !rendererRef.current) {
          mountRef.current = ref;
          initThreeJS();
        }
      }}
      className="relative bg-gray-900"
    >
      {isReady && cameraRef.current && rendererRef.current && controlsRef.current && (
        <ViewCube camera={cameraRef.current} renderer={rendererRef.current} controls={controlsRef.current} />
      )}
    </div>
  );
};

export default GeometryScene;
