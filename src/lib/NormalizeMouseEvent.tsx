import * as THREE from "three";

/**
 * Chuyển đổi MouseEvent sang tọa độ NDC [-1, 1] cho raycasting.
 * @param event MouseEvent từ DOM
 * @param canvas HTMLCanvasElement đang render
 * @returns THREE.Vector2 (tọa độ x, y đã chuẩn hóa)
 */
export function NormalizeMouseEvent(
  event: MouseEvent,
  canvas: HTMLCanvasElement
): THREE.Vector2 {
  const rect = canvas.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  return new THREE.Vector2(x, y);
}
