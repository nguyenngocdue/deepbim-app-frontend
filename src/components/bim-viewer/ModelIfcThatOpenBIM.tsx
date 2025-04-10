import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { removeBoxHelperFromScene } from "@/lib/BoudingBox";
import { resetModelToOriginalState } from "@/lib/ModelUtils";
import * as OBCF from "@thatopen/components-front";
import * as F from "three";


declare module "three" {
    interface BufferGeometry {
        computeBoundsTree?: () => void;
        disposeBoundsTree?: () => void;
    }
}

declare module "three" {
    interface Mesh {
        raycast: (raycaster: THREE.Raycaster, intersects: Array<THREE.Intersection>) => void;
    }
}
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVH } from "three-mesh-bvh";
import { ThreeHighlighter } from "@/lib/effects/HighlightElement";

// Gán các phương thức BVH vào prototype của BufferGeometry và Mesh
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

interface ModelIfcProps {
    sectionActive: boolean; // Trạng thái Section Box từ component cha
    coordinateSyssActive: boolean;
    selectedFile: string | null; // Selected file path
    onFileSelect: (filePath: Uint8Array | null) => void; // File selection handler
}


const ModelIfc: React.FC<ModelIfcProps> = ({ sectionActive, coordinateSyssActive, selectedFile, onFileSelect }) => {
    const ifcContainerRef = useRef<HTMLDivElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const transformControlsRef = useRef<TransformControls[]>([]);
    const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);



    const [isRaycastingMode, setIsRaycastingMode] = useState(false);
    useEffect(() => {
        if (selectedFile) {
            loadIfcModel()
        }
    }, [selectedFile]);


    function regenerateHighlight(
        mesh: THREE.Mesh,
        indices: Iterable<number>,
        instance: number | undefined,
        getVerts: (
          mesh: THREE.Mesh,
          faceIndex: number,
          instance?: number
        ) => {
          p1: THREE.Vector3;
          p2: THREE.Vector3;
          p3: THREE.Vector3;
        }
      ): { geometry: THREE.BufferGeometry; area: number } {
        const positions: number[] = [];
        const triangleIndices: number[] = [];
        let area = 0;
        let counter = 0;
      
        const triangle = new THREE.Triangle();
      
        for (const faceIndex of indices) {
          const { p1, p2, p3 } = getVerts(mesh, faceIndex, instance);
      
          positions.push(p1.x, p1.y, p1.z);
          positions.push(p2.x, p2.y, p2.z);
          positions.push(p3.x, p3.y, p3.z);
      
          triangle.set(p1, p2, p3);
          area += triangle.getArea();
      
          triangleIndices.push(counter, counter + 1, counter + 2);
          counter += 3;
        }
      
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(triangleIndices);
        geometry.computeVertexNormals();
      
        return { geometry, area };
      }
      
      
      


    useEffect(() => {

        const handleCanvasClick = (event: MouseEvent) => {
              //Getting the highlighter
              const components = new OBC.Components();
              const world = worldRef.current;
            
              if (!world) return;
            
              const raycasters = components.get(OBC.Raycasters);
              let caster = raycasters.get(world);
              if (!caster) {
                raycasters.set(world);
                caster = raycasters.get(world);
              }
            
              caster.camera = world.camera.three;
              caster.world = world;
            
              const canvas = world.renderer.three.domElement;
   
                const rect = canvas.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
                // ✅ Cập nhật vị trí chuột theo chuẩn Normalized Device Coordinates
                caster.mouse.position.set(x, y);

                const meshes: THREE.Mesh[] = [];
                world.scene.three.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        meshes.push(child);
                    }
                });
                const result = caster.castRay(meshes); // Trả về object hoặc null
                const measurements = components.get(OBC.MeasurementUtils);
                if (result && result.face && result.object) {
                    const mesh = result.object as THREE.Mesh | THREE.InstancedMesh;
                    const instance = result.instance;
                    const faceIndex = result.faceIndex!;

                    // 1. Lấy thông tin các mặt từ MeasurementUtils
                    const faceData = measurements.getFace(mesh, faceIndex, instance);
                    if (!faceData || !faceData.indices) {
                        console.warn("❌ Không lấy được face từ measurements.");
                        return;
                    }

                    const faceIndices = Array.from(faceData.indices);

                    // 2. Tính geometry và diện tích
                    const { geometry, area } = regenerateHighlight(
                        mesh,
                        faceIndices,
                        instance,
                        (m, i, inst) => measurements.getVerticesAndNormal(m, i, inst)
                    );

                    console.log("📐 Diện tích mặt được chọn:", area.toFixed(4));
                    // 3. Tạo material highlight
                    const highlightMaterial = new THREE.MeshBasicMaterial({
                        color: 0x00ffcc,
                        opacity: 0.6,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthTest: false
                    });

                    const highlightMesh = new THREE.Mesh(geometry, highlightMaterial);
                    // 4. Đặt về đúng vị trí trong thế giới
                    highlightMesh.position.set(0, 0, 0);
                    highlightMesh.rotation.set(0, 0, 0);
                    highlightMesh.scale.set(1, 1, 1);
                    highlightMesh.updateMatrix();

                    if (mesh instanceof THREE.InstancedMesh && instance !== undefined) {
                        const matrix = new THREE.Matrix4();
                        mesh.getMatrixAt(instance, matrix);
                        highlightMesh.applyMatrix4(matrix);
                    } else {
                        highlightMesh.applyMatrix4(mesh.matrixWorld);
                    }
                    // 5. Thêm vào scene
                    world.scene.three.add(highlightMesh);
                  }
        };

        const container = ifcContainerRef.current;
        container.addEventListener("click", handleCanvasClick);
    
        return () => {
            container.removeEventListener("click", handleCanvasClick);
        };
    }, [sectionActive]);


    

    useEffect(() => {
        if (!ifcContainerRef.current) return;
        toggleSectionBox()
    }, [sectionActive ]);


    useEffect(() => {
        if (!ifcContainerRef.current) return;

        // Initialize components
        const components = new OBC.Components();
        const world = components.get(OBC.Worlds).create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBCF.PostproductionRenderer
        >();

       
        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBCF.PostproductionRenderer(components, ifcContainerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        components.init();
        world.renderer.postproduction.enabled = true;
        world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

        world.scene.three.background = new THREE.Color(0xcccccc);
        world.scene.setup();

        // Grid
        // const grids = components.get(OBC.Grids);
        // const grid = grids.create(world);
        // world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

        // Setup Orbit Controls
        // const controls = new OrbitControls(world.camera.three, world.renderer.three.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.1;
        // controlsRef.current = controls;

        
        // Getting the highlighter
        worldRef.current = world;
        // const highlighter = components.get(OBCF.Highlighter);    
        // highlighter.setup({ world : worldRef.current });
        // highlighter.zoomToSelection = true;


        // const outliner = components.get(OBCF.Outliner);
        // outliner.world = world;
        // outliner.enabled = true;

        // outliner.create(
        // "example",
        // new THREE.MeshBasicMaterial({
        //     color: 0xbcf124,
        //     transparent: true,
        //     opacity: 0.5,
        // }),
        // );

        // highlighter.events.select.onHighlight.add((data) => {
        // outliner.clear("example");
        // outliner.add("example", data);
        // });

        // highlighter.events.select.onClear.add(() => {
        // outliner.clear("example");
        // });




        loadIfcModel();

        const animate = () => {
            if (!worldRef.current || !worldRef.current.renderer) return;

            requestAnimationFrame(animate);
            // controls.update();
            worldRef.current.renderer.update();
        };
        animate();

        return () => {
            // controls.dispose();
            transformControlsRef.current.forEach(control => control.dispose());
            components.dispose();
            worldRef.current = null; // Reset worldRef khi unmount
        };
    }, [sectionActive]);

    const loadIfcModel = async () => {
        if (!worldRef.current) return;

        try {
            const ifcLoader = worldRef.current.components.get(OBC.IfcLoader);
            await ifcLoader.setup();
            // API
            const response = await fetch("/ifc/small.ifc");
            // const response = await fetch("/ifc/Archicad.ifc");
            if (!response.ok) throw new Error("Can't upload IFC");
            const buffer = await response.arrayBuffer();
            const model = await ifcLoader.load(new Uint8Array(buffer));

            // console.log(selectedFile);
            // const model = await ifcLoader.load(selectedFile);


           

            // 2. Store the model in modelRef
            modelRef.current = model;

            // Add model to the scene
            if (model) {
                worldRef.current.scene.three.add(model);
            }

            if (boxHelperRef.current) {
                worldRef.current!.scene.three.remove(boxHelperRef.current);
            }


        } catch (error) {
            console.error("Error loading IFC:", error);
        }
    };

    

    

    




    const toggleSectionBox = () => {
        // If we are activating the section box (newState is true)
        if (sectionActive) {

            // Enable raycasting mode when section box is deactivated
            setIsRaycastingMode(true);

        } else {
           
        }
        return sectionActive;
    };

    return (
        <div className="relative w-screen h-screen">
            <div ref={ifcContainerRef} className="w-full h-full" />
        </div>
    );
};

export default ModelIfc;