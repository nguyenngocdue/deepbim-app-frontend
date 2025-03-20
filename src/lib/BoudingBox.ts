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


// 🟢 Cập nhật Bounding Box dựa trên vị trí mũi tên (ArrowHelper)
export const updateBoundingBoxByArrow = (
    arrows: THREE.ArrowHelper[], // Mảng các mũi tên ArrowHelper
    planes: THREE.Plane[],       // Mảng các mặt phẳng clipping
    boxHelperRef: React.RefObject<THREE.Box3Helper | null>, // Tham chiếu đến Box3Helper
    scene: THREE.Scene // Scene Three.js để thêm vào Box3Helper
) => {
    const newBbox = new THREE.Box3();
    

    // Tính toán Bounding Box từ các mũi tên
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

    // 🟢 Cập nhật hoặc tạo lại Bounding Box từ vùng mới
    if (boxHelperRef.current) {
        scene.remove(boxHelperRef.current); // Xóa Bounding Box cũ
    }

    const dashedMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6, // Chuyển đổi số hex thành THREE.Color
        linewidth: 2,   // Độ dày nét vẽ
        dashed: true,   // Bật nét đứt
        dashSize: 2,  // Kích thước mỗi đoạn đứt
        gapSize: 2    // Kích thước khoảng cách giữa các đoạn đứt
    });

    // Tạo mới Box3Helper từ Bounding Box đã tính toán
    boxHelperRef.current = new THREE.Box3Helper(newBbox, 0x3b82f6);
    scene.add(boxHelperRef.current); // Thêm vào scene

    // console.log("Updated Bounding Box:", newBbox);
};


