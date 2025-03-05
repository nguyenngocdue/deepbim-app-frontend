import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function InstancedMesh() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (rendererRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Thêm `OrbitControls`
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.addEventListener("start", () => setIsRotating(true));
    controls.addEventListener("end", () => setIsRotating(false));

    // Tạo InstancedMesh với random màu
    const count = 100;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ vertexColors: true }); // Dùng vertex color
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const colors = new Float32Array(count * 3); // RGB cho từng instance

    for (let i = 0; i < count; i++) {
      // Random vị trí
      dummy.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Random màu
      colors[i * 3] = Math.random(); // Red
      colors[i * 3 + 1] = Math.random(); // Green
      colors[i * 3 + 2] = Math.random(); // Blue
    }

    // Gán màu vào InstancedMesh
    instancedMesh.geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colors, 3)
    );
    instancedMesh.instanceMatrix.needsUpdate = true;

    // Thêm ánh sáng
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight("#D9D2E9"));

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (isRotating) {
        for (let i = 0; i < count; i++) {
          instancedMesh.getMatrixAt(i, dummy.matrix);
          dummy.rotation.y += 0.01;
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [isRotating]);

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
