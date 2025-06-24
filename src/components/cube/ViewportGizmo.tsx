import * as THREE from 'three';
import { ViewportGizmo } from 'three-viewport-gizmo';
import { OrbitControls, OrbitControls as ThreeOrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

export function useViewportGizmo({
  camera,
  renderer,
}: {
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  controls?: ThreeOrbitControls;
}) {
    const controls = new OrbitControls(camera, renderer.domElement);
    const gizmo = new ViewportGizmo(camera, renderer);
    console.log(gizmo);

}