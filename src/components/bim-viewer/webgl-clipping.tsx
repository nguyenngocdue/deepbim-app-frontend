import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const WebglClipping: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let object: THREE.Mesh;
    let gui: GUI;
    let startTime = Date.now();

    // Initialize Renderer
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.localClippingEnabled = true;
    }
    const renderer = rendererRef.current;

    // Initialize Stats
    if (!statsRef.current) {
      statsRef.current = new Stats();
      statsRef.current.dom.style.pointerEvents = "none"; // Prevents blocking mouse interactions
    }
    const stats = statsRef.current;

    // Initialize Scene
    scene = new THREE.Scene();

    // Initialize Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.25, 50);
    camera.position.set(0, 1.3, 3);

    // Initialize OrbitControls (Ensuring it exists only once)
    if (!controlsRef.current) {
      controlsRef.current = new OrbitControls(camera, renderer.domElement);
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  

    // Lighting Setup
    scene.add(new THREE.AmbientLight(0xcccccc));

    const spotLight = new THREE.SpotLight(0xffffff, 60);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    spotLight.position.set(2, 3, 3);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const dirLight = new THREE.DirectionalLight(0x55505a, 3);
    dirLight.position.set(0, 3, 0);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Clipping Planes
    const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.1);
    const globalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.2);
    const globalPlanes: THREE.Plane[] = [globalPlane];
    const Empty: THREE.Plane[] = [];
    renderer.clippingPlanes = Empty;

    // Hiển thị Local Plane với PlaneHelper
    const planeHelper = new THREE.PlaneHelper(localPlane, 2, 0xff0000); // Màu đỏ
    scene.add(planeHelper);

    // Bounding Box (hình hộp) có clipping
    const bboxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Kích thước bounding box
    const bboxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // Màu xanh lá
    wireframe: true, // Chỉ hiển thị đường viền
    clippingPlanes: [localPlane], // Cắt theo localPlane
    side: THREE.DoubleSide,
    });
    const planeBoundingBox = new THREE.Mesh(bboxGeometry, bboxMaterial);
    scene.add(planeBoundingBox);

    // Cập nhật Bounding Box theo Local Plane
    function updateBoundingBox() {
        planeBoundingBox.position.set(0, -localPlane.constant, 0);
    }


    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    // Material & Object
    const material = new THREE.MeshPhongMaterial({
      color: 0x80ee10,
      shininess: 100,
      side: THREE.DoubleSide,
      clippingPlanes: [localPlane],
      clipShadows: true,
      alphaToCoverage: true,
    });

    object = new THREE.Mesh(new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20), material);
    object.castShadow = true;
    scene.add(object);

    // Ground Plane
    const plan = new THREE.PlaneGeometry(5, 5);
    const ground = new THREE.Mesh(
        plan,
      new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150,  side: THREE.DoubleSide })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // GUI Setup
    gui = new GUI();
    gui.add({ alphaToCoverage: true }, "alphaToCoverage").onChange((value) => {
      ground.material.alphaToCoverage = value;
      ground.material.needsUpdate = true;
      material.alphaToCoverage = value;
      material.needsUpdate = true;
    });

    const folderLocal = gui.addFolder("Local Clipping");
    folderLocal.add(renderer, "localClippingEnabled").name("Enabled");
    folderLocal.add(material, "clipShadows").name("Shadows");
    folderLocal.add(localPlane, "constant", -0.1, 1.25).name("Plane");

    const folderGlobal = gui.addFolder("Global Clipping");
    folderGlobal.add({
      get Enabled() {
        return renderer.clippingPlanes !== Empty;
      },
      set Enabled(v) {
        renderer.clippingPlanes = v ? globalPlanes : Empty;
      },
    }, "Enabled");
    folderGlobal.add(globalPlane, "constant", -0.4, 3).name("Plane");

    // Append Elements (Prevent Duplication)
    if (mountRef.current) {
      if (!mountRef.current.contains(renderer.domElement)) {
        mountRef.current.appendChild(renderer.domElement);
      }
      if (!mountRef.current.contains(stats.dom)) {
        mountRef.current.appendChild(stats.dom);
      }
    }
   
    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      const time = (Date.now() - startTime) / 1000;
      object.rotation.x = time * 0.5;
      object.rotation.y = time * 0.2;
      object.scale.setScalar(Math.cos(time) * 0.125 + 0.875);

      controls.update(); // Ensuring OrbitControls update
      renderer.render(scene, camera);
      stats.update();
      updateBoundingBox();
    }
    animate();

    // Window Resize Handler
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // Cleanup Function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default WebglClipping;
