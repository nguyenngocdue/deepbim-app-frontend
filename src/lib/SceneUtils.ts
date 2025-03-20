// SceneUtils.ts
import * as THREE from "three";
import { createPlaneHelper, createPlaneOutline } from "./PlaneUtils";

/**
 * Thêm các mặt phẳng cắt vào scene.
 * @param world - Đối tượng world chứa scene của Three.js.
 * @param planes - Mảng các mặt phẳng cần hiển thị.
 * @param useOutline - Nếu true, hiển thị dưới dạng đường viền; nếu false, hiển thị dưới dạng hình chữ nhật.
 */
export const addPlaneHelpersToScene = (
    world: { scene: { three: THREE.Scene } },
    planes: THREE.Plane[],
    useOutline: boolean = false
) => {
    if (!world || !world.scene || !world.scene.three) return;

    // Tính toán kích thước lớn nhất của mô hình trong scene
    const bbox = new THREE.Box3().setFromObject(world.scene.three);
    const size = Math.max(
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y,
        bbox.max.z - bbox.min.z
    );

    // Thêm từng mặt phẳng vào scene
    planes.forEach((plane) => {
        if (useOutline) {
            // Hiển thị dưới dạng đường viền
            const planeOutline = createPlaneOutline(plane, size, 0x00ff00); // Màu xanh lá
            world.scene.three.add(planeOutline);
        } else {
            // Hiển thị dưới dạng hình chữ nhật
            const planeHelper = createPlaneHelper(plane, size, 0xff0000); // Màu đỏ
            world.scene.three.add(planeHelper);
        }
    });
};