import React, { useEffect, useRef } from "react";
import LoadingSpinner from "@/components/bim-viewer/loading-spinner";
import { useIfcLoader } from "@/hooks/use-ifc-loader";
import * as THREE from "three";

const IfcViewerSelectionFamily: React.FC = () => {
    const gridContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 🏗️ Sử dụng custom hook IFC Loader
    const { ifcContainerRef, loadIfc, loading, ifcWorldRef } = useIfcLoader();

    // 🏗️ Raycaster và Mouse
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    // 🏗️ Biến lưu trữ object đang hover
    const hoveredObject = useRef<THREE.Object3D | null>(null);
    const originalColor = useRef<THREE.Color | null>(null);

    // 🏗️ Hàm xử lý hover IFC
    const onDocumentMouseMove = (event: MouseEvent) => {
        if (!ifcWorldRef.current) return;
    
        event.preventDefault();
        
        // Cập nhật vị trí chuột
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        const ifcWorld = ifcWorldRef.current;
    
        // Thiết lập raycaster dựa trên camera
        raycaster.current.setFromCamera(mouse.current, ifcWorld.camera.controls.camera);
    
        // Kiểm tra va chạm với scene của IFC
        const intersects = raycaster.current.intersectObjects(ifcWorld.scene.three.children, true);
    
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const object = intersection.object as THREE.InstancedMesh;
            const instanceId = intersection.instanceId; // Instance bị hit (nếu có)
    
            console.log("🎯 Hovered Object:", object);

            // 🏗 Tìm `FragmentGroup` hoặc `parent` chứa toàn bộ Family
            let familyGroup: THREE.Object3D | null = object;
            while (familyGroup && familyGroup.parent && !familyGroup.parent.userData?.isFamily) {
                familyGroup = familyGroup.parent;
            }

            console.log("🏠 Family Group Found:", familyGroup);
    
            // 🏗 Kiểm tra nếu object là `InstancedMesh`
            if (object.isInstancedMesh && instanceId !== undefined) {
                const instanceColor = object.instanceColor;
    
                if (instanceColor) {
                    // 🔄 Khôi phục màu cũ của object trước đó nếu có
                    if (hoveredObject.current && originalColor.current) {
                        const oldColorArray = hoveredObject.current.instanceColor!.array as Float32Array;
                        const oldIndex = hoveredObject.current.userData.instanceId * 3;
                        oldColorArray[oldIndex] = originalColor.current.r;
                        oldColorArray[oldIndex + 1] = originalColor.current.g;
                        oldColorArray[oldIndex + 2] = originalColor.current.b;
                        hoveredObject.current.instanceColor!.needsUpdate = true;
                    }
    
                    // Lưu object mới
                    hoveredObject.current = object;
                    hoveredObject.current.userData.instanceId = instanceId;
    
                    // 🔄 Lưu màu gốc
                    const colorArray = instanceColor.array as Float32Array;
                    const index = instanceId * 3;
                    originalColor.current = new THREE.Color(
                        colorArray[index],
                        colorArray[index + 1],
                        colorArray[index + 2]
                    );
    
                    // 🎨 Đổi màu khi hover
                    const newColor = new THREE.Color("#b3ffff");
                    colorArray[index] = newColor.r;
                    colorArray[index + 1] = newColor.g;
                    colorArray[index + 2] = newColor.b;
    
                    instanceColor.needsUpdate = true;
                }
            } 
            // 🏗 Nếu object là một `Mesh` thông thường
            else if (object.material) {
                if (hoveredObject.current !== object) {
                    if (hoveredObject.current && originalColor.current) {
                        if (Array.isArray(hoveredObject.current.material)) {
                            hoveredObject.current.material.forEach((mat) => {
                                if (mat.color) mat.color.set(originalColor.current!);
                            });
                        } else {
                            hoveredObject.current.material.color.set(originalColor.current);
                        }
                    }
    
                    // Lưu object mới
                    hoveredObject.current = object;
    
                    // 🔄 Lưu màu gốc nếu có material
                    if (Array.isArray(object.material)) {
                        originalColor.current = object.material[0].color.clone();
                        object.material.forEach((mat) => mat.color.set("#b3ffff"));
                    } else {
                        originalColor.current = object.material.color.clone();
                        object.material.color.set("#b3ffff");
                    }
                }
            }
        } else {
            // 🔄 Khôi phục màu gốc khi rời chuột
            if (hoveredObject.current && originalColor.current) {
                if (hoveredObject.current.isInstancedMesh) {
                    const colorArray = hoveredObject.current.instanceColor!.array as Float32Array;
                    const index = hoveredObject.current.userData.instanceId * 3;
                    colorArray[index] = originalColor.current.r;
                    colorArray[index + 1] = originalColor.current.g;
                    colorArray[index + 2] = originalColor.current.b;
                    hoveredObject.current.instanceColor!.needsUpdate = true;
                } else if (hoveredObject.current.material) {
                    if (Array.isArray(hoveredObject.current.material)) {
                        hoveredObject.current.material.forEach((mat) => mat.color.set(originalColor.current!));
                    } else {
                        hoveredObject.current.material.color.set(originalColor.current);
                    }
                }
            }
    
            hoveredObject.current = null;
            originalColor.current = null;
        }
    };
    

    useEffect(() => {
        if (!ifcWorldRef.current) return;

        document.addEventListener("mousemove", onDocumentMouseMove);

        // Cleanup khi component unmount
        return () => {
            document.removeEventListener("mousemove", onDocumentMouseMove);
        };
    }, [loading]);

    /** 🏗️ Handle IFC file upload */
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                if (reader.result) {
                    const buffer = new Uint8Array(reader.result as ArrayBuffer);
                    loadIfc(buffer);
                }
            };
        }
    };

    return (
        <div className="w-full h-full relative">
            <div ref={gridContainerRef} className="absolute inset-0 z-0" />
            <div ref={ifcContainerRef} className="absolute inset-0 z-10" />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <LoadingSpinner />
                </div>
            )}

            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-lg z-20">
                <input type="file" ref={fileInputRef} accept=".ifc" onChange={handleFileChange} className="hidden" />
                <button className="bim-button" onClick={() => fileInputRef.current?.click()}>Upload IFC</button>
            </div>
        </div>
    );
};

export default IfcViewerSelectionFamily;
