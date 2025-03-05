import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const WebglClippingStencilIfc: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!mountRef.current || initializedRef.current) return;
        initializedRef.current = true;

        let renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene;
        let controls: OrbitControls, stats: Stats;
        let planes: THREE.Plane[], planeHelpers: THREE.PlaneHelper[];
        let object: THREE.Group, clock: THREE.Clock;

        const params = {
            animate: true,
            planeX: { constant: 0, negated: false, displayHelper: false },
            planeY: { constant: 0, negated: false, displayHelper: false },
            planeZ: { constant: 0, negated: false, displayHelper: false },
        };

        const init = () => {
            clock = new THREE.Clock();
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
            camera.position.set(2, 2, 2);
            scene.add(new THREE.AmbientLight(0xffffff, 1.5));

            const dirLight = new THREE.DirectionalLight(0xffffff, 3);
            dirLight.position.set(5, 10, 7.5);
            scene.add(dirLight);

            planes = [
                new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
                new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
                new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
            ];
            console.log(planes)

            planeHelpers = planes.map(p => new THREE.PlaneHelper(p, 2, 0xffffff));
            planeHelpers.forEach(ph => {
                ph.visible = false;
                scene.add(ph);
            });

            const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 220, 60);
            object = new THREE.Group();
            scene.add(object);
            
            // Tạo vật liệu cho phần bên trong bị cắt
            const insideMaterial = new THREE.MeshStandardMaterial({
                color: 0xD81B60, // Màu đỏ hồng giống hình mẫu
                metalness: 0.1,
                roughness: 0.75,
                clippingPlanes: planes, // Vẫn bị cắt bởi planes
                side: THREE.BackSide, // Lật mặt để hiển thị bên trong
            });

            // Clone geometry để tạo phần cắt
            const innerMesh = new THREE.Mesh(geometry, insideMaterial);
            innerMesh.renderOrder = 5; // Đảm bảo hiển thị đúng lớp
            object.add(innerMesh);

            const material = new THREE.MeshStandardMaterial({
                color: 0xFFC107,
                metalness: 0.1,
                roughness: 0.75,
                clippingPlanes: planes,
                clipShadows: true,
                shadowSide: THREE.DoubleSide,
            });

            const clippedColorFront = new THREE.Mesh(geometry, material);
            clippedColorFront.castShadow = true;
            clippedColorFront.renderOrder = 6;
            object.add(clippedColorFront);

            renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x263238);
            renderer.setAnimationLoop(animate);
            renderer.shadowMap.enabled = true;
            renderer.localClippingEnabled = true;
            mountRef.current.appendChild(renderer.domElement);

            stats = new Stats();
            document.body.appendChild(stats.dom);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.minDistance = 2;
            controls.maxDistance = 20;
            controls.update();

            const gui = new GUI();
            gui.add(params, 'animate');

            const planeX = gui.addFolder('planeX');
            planeX.add(params.planeX, 'displayHelper').onChange(v => planeHelpers[0].visible = v);
            planeX.add(params.planeX, 'constant').min(-1).max(1).onChange(d => planes[0].constant = d);
            planeX.add(params.planeX, 'negated').onChange(() => {
                planes[0].negate();
                params.planeX.constant = planes[0].constant;
            });
            planeX.open();

            const planeY = gui.addFolder('planeY');
            planeY.add(params.planeY, 'displayHelper').onChange(v => planeHelpers[1].visible = v);
            planeY.add(params.planeY, 'constant').min(-1).max(1).onChange(d => planes[1].constant = d);
            planeY.add(params.planeY, 'negated').onChange(() => {
                planes[1].negate();
                params.planeY.constant = planes[1].constant;
            });
            planeY.open();

            const planeZ = gui.addFolder('planeZ');
            planeZ.add(params.planeZ, 'displayHelper').onChange(v => planeHelpers[2].visible = v);
            planeZ.add(params.planeZ, 'constant').min(-1).max(1).onChange(d => planes[2].constant = d);
            planeZ.add(params.planeZ, 'negated').onChange(() => {
                planes[2].negate();
                params.planeZ.constant = planes[2].constant;
            });
            planeZ.open();
        };

        function animate() {
            const delta = clock.getDelta();
            if (params.animate) {
                object.rotation.x += delta * 0.5;
                object.rotation.y += delta * 0.2;
            }
            stats.begin();
            renderer.render(scene, camera);
            stats.end();
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        init();

        return () => {
            window.removeEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} />;
};

export default WebglClippingStencilIfc;
