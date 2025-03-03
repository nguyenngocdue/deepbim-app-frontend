import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InstancedMesh() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null); // Store renderer reference

  useEffect(() => {
    // If the renderer already exists, do nothing
    if (rendererRef.current) return;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Remove old canvas if it exists
    if (mountRef.current?.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Append Renderer to DOM inside React ref
    mountRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer; // Store renderer reference

    // Handle Resize Events
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Create Geometry & Material
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Create InstancedMesh with 100 instances
    const count = 100;
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

    // Apply transformations to each instance
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    // Add InstancedMesh to Scene
    scene.add(instancedMesh);

    // Camera Position
    camera.position.z = 50;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on Unmount
    return () => {
      renderer.dispose();
      rendererRef.current = null; // Remove reference
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
