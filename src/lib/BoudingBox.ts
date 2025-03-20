import { RefObject } from 'react';
import * as THREE from 'three';

export const addBoundingBox = (model: THREE.Object3D) => {
    const bbox = new THREE.Box3().setFromObject(model); // Lấy kích thước model
    const bboxHelper = new THREE.Box3Helper(bbox, 0x00ff00); // Màu xanh lá
    worldRef.current!.scene.three.add(bboxHelper);
};

export const animateBoundingBox = (boxHelper: THREE.BoxHelper, model: THREE.Object3D) => {
    const updateBox = () => {
        requestAnimationFrame(updateBox);
        boxHelper.update(); // Cập nhật lại Bounding Box
    };
    updateBox();
};



export const updateBoundingBoxByArrow = (
    arrows: THREE.ArrowHelper[],  // Mảng các mũi tên ArrowHelper
    planes: THREE.Plane[],        // Mảng các mặt phẳng clipping
    boxHelperRef: RefObject<THREE.Box3Helper | null>, // Tham chiếu đến Box3Helper
    scene: THREE.Scene            // Scene Three.js để thêm vào Box3Helper
) => {
    // Tạo một Bounding Box mới
    const newBbox = new THREE.Box3();
    
    // 🟢 Tính toán Bounding Box từ các mũi tên
    arrows.forEach((arrow, index) => {
        const plane = planes[index];

        // Lấy vị trí của mũi tên và cập nhật Bounding Box
        const arrowPos = arrow.position.clone();
        if (plane.normal.x !== 0) {
            newBbox.min.x = Math.min(newBbox.min.x, arrowPos.x);
            newBbox.max.x = Math.max(newBbox.max.x, arrowPos.x);
        }
        if (plane.normal.y !== 0) {
            newBbox.min.y = Math.min(newBbox.min.y, arrowPos.y);
            newBbox.max.y = Math.max(newBbox.max.y, arrowPos.y);
        }
        if (plane.normal.z !== 0) {
            newBbox.min.z = Math.min(newBbox.min.z, arrowPos.z);
            newBbox.max.z = Math.max(newBbox.max.z, arrowPos.z);
        }
    });

    // 🟢 Nếu Box3Helper cũ tồn tại, xóa nó đi
    if (boxHelperRef.current) {
        scene.remove(boxHelperRef.current); // Xóa Bounding Box cũ khỏi scene
        // Giải phóng tài nguyên geometry và material
        boxHelperRef.current.geometry.dispose(); 
        boxHelperRef.current.material.dispose(); 
        boxHelperRef.current = null; // Đảm bảo xóa đối tượng
    }

    // 🟢 Tạo vật liệu tùy chỉnh với hiệu ứng nét đứt
    const dashedMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,  // Màu blue-400
        linewidth: 1,     // Độ dày nét vẽ (lưu ý: không phải tất cả trình duyệt đều hỗ trợ)
        dashed: true,     // Bật nét đứt
        dashSize: 0.1,    // Kích thước mỗi đoạn đứt
        gapSize: 0.1      // Khoảng cách giữa các đoạn đứt
    });

    // 🟢 Tạo mới Box3Helper với màu mặc định
    boxHelperRef.current = new THREE.Box3Helper(newBbox);

    // 🟢 Gán vật liệu tùy chỉnh cho Box3Helper
    boxHelperRef.current.material = dashedMaterial;

    // Thêm Box3Helper vào scene
    scene.add(boxHelperRef.current);

    console.log("Updated Bounding Box:", newBbox);
};

