// PlaneUtils.ts
import * as THREE from "three";

/**
 * Tạo một mesh đại diện cho mặt phẳng cắt.
 * @param plane - Mặt phẳng cần hiển thị.
 * @param size - Kích thước của hình chữ nhật biểu diễn mặt phẳng.
 * @param color - Màu sắc của mặt phẳng.
 * @returns Một mesh đại diện cho mặt phẳng.
 */
export const createPlaneHelper = (plane: THREE.Plane, size: number, color: number) => {
    // Tạo hình học hình chữ nhật
    const geometry = new THREE.PlaneGeometry(size, size);

    // Tạo vật liệu trong suốt
    const material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });

    // Tạo mesh từ hình học và vật liệu
    const mesh = new THREE.Mesh(geometry, material);

    // Định vị mesh theo mặt phẳng
    const normal = plane.normal;
    const constant = plane.constant;

    // Tính toán vị trí của mặt phẳng
    mesh.position.copy(normal.clone().multiplyScalar(-constant));

    // Quay mesh để nó song song với mặt phẳng
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    mesh.quaternion.copy(quaternion);

    return mesh;
};

/**
 * Tạo một đường viền đại diện cho mặt phẳng cắt.
 * @param plane - Mặt phẳng cần hiển thị.
 * @param size - Kích thước của hình chữ nhật biểu diễn mặt phẳng.
 * @param color - Màu sắc của đường viền.
 * @returns Một LineSegments đại diện cho đường viền của mặt phẳng.
 */
export const createPlaneOutline = (plane: THREE.Plane, size: number, color: number) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    // Tạo 4 điểm của hình chữ nhật
    const normal = plane.normal;
    const tangent = new THREE.Vector3().crossVectors(normal, new THREE.Vector3(0, 0, 1)).normalize();
    const binormal = new THREE.Vector3().crossVectors(normal, tangent).normalize();

    const halfSize = size / 2;
    vertices.push(
        tangent.clone().multiplyScalar(-halfSize).add(binormal.clone().multiplyScalar(-halfSize)),
        tangent.clone().multiplyScalar(halfSize).add(binormal.clone().multiplyScalar(-halfSize)),
        tangent.clone().multiplyScalar(halfSize).add(binormal.clone().multiplyScalar(halfSize)),
        tangent.clone().multiplyScalar(-halfSize).add(binormal.clone().multiplyScalar(halfSize))
    );

    // Tạo các cạnh của hình chữ nhật
    const indices = [0, 1, 1, 2, 2, 3, 3, 0];
    geometry.setFromPoints(vertices);
    geometry.setIndex(indices);

    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.LineSegments(geometry, material);
};



